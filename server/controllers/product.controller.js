const mongoose = require("mongoose");
const Product = require("../models/Product");
const Artist = require("../models/Artist");
const ProductChangeLog = require("../models/ProductChangeLog");
const fields = [
  "code",
  "name",
  "description",
  "price",
  "quantity",
  "date",
  "tags",
  "sizes",
  "featured",
  "category",
  "artist",
  "imageUrl",
  "imageUrls",
  "imageFit",
];
const pick = (body) =>
  Object.fromEntries(
    fields
      .filter((key) => body[key] !== undefined)
      .map((key) => [key, body[key]]),
  );
const isStoredImage = (value) =>
  typeof value === "string" && value.startsWith("data:image/");
const imageEndpoint = (id) => `/api/products/${id}/image`;
const serializeProduct = (product) => {
  const value = product.toObject ? product.toObject() : { ...product };
  if (isStoredImage(value.imageUrl)) {
    const url = imageEndpoint(value._id);
    value.imageUrl = url;
    value.imageUrls = (value.imageUrls || []).map((image) =>
      isStoredImage(image) ? url : image,
    );
  }
  return value;
};
const serializeListProduct = (product) => {
  const value = serializeProduct(product);
  // The admin table only needs a preview URL. Avoid reading the potentially
  // multi-megabyte image fields while loading products for editing.
  if (!value.imageUrl) value.imageUrl = imageEndpoint(value._id);
  return value;
};
const removeGeneratedImageReferences = (input) => {
  if (/^\/api\/products\/[a-f\d]{24}\/image$/i.test(input.imageUrl || "")) {
    delete input.imageUrl;
    delete input.imageUrls;
  }
  return input;
};
const removeDuplicateSingleImage = (input) => {
  // The admin form supplies the first upload in both fields.  Keep one copy
  // when there is only one image so a request does not store the same base64
  // payload twice in MongoDB.
  if (
    Array.isArray(input.imageUrls) &&
    input.imageUrls.length === 1 &&
    input.imageUrls[0] === input.imageUrl
  )
    input.imageUrls = [];
  return input;
};
const snapshot = (product) => {
  const value = product.toObject ? product.toObject() : product;
  delete value.__v;
  if (isStoredImage(value.imageUrl)) value.imageUrl = "[stored image]";
  if (Array.isArray(value.imageUrls))
    value.imageUrls = value.imageUrls.map((image) =>
      isStoredImage(image) ? "[stored image]" : image,
    );
  return value;
};
const logChange = async (change) => {
  try {
    await ProductChangeLog.create(change);
  } catch (error) {
    // Audit logging must never prevent the product operation itself from succeeding.
    console.error("[product change log]", error.message);
  }
};
const escapeRegex = (value) =>
  String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The storefront always filters and paginates in MongoDB.  This keeps the
// result count and each page correct even when the catalogue grows large.
exports.listPublic = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      100,
    );
    const filter = {};
    const conditions = [];
    const tagPattern = (value) => new RegExp(`^${escapeRegex(value)}$`, "i");

    if (
      req.query.category &&
      mongoose.Types.ObjectId.isValid(req.query.category)
    )
      filter.category = req.query.category;
    if (req.query.artist && mongoose.Types.ObjectId.isValid(req.query.artist))
      filter.artist = req.query.artist;
    if (req.query.artistName) {
      const matchingArtists = await Artist.find({
        name: new RegExp(`^${escapeRegex(req.query.artistName)}$`, "i"),
      }).select("_id");
      filter.artist = { $in: matchingArtists.map((artist) => artist._id) };
    }

    const genre = String(req.query.genre || "")
      .trim()
      .toLowerCase();
    if (genre && /^[a-z-]+$/.test(genre))
      conditions.push({ tags: `genre:${genre}` });

    const search = String(req.query.search || "").trim();
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      conditions.push({
        $or: [{ name: regex }, { description: regex }, { tags: regex }],
      });
    }

    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      const price = {};
      const minPrice = Number(req.query.minPrice);
      const maxPrice = Number(req.query.maxPrice);
      if (Number.isFinite(minPrice)) price.$gte = minPrice;
      if (Number.isFinite(maxPrice)) price.$lte = maxPrice;
      if (Object.keys(price).length) conditions.push({ price });
    }

    if (req.query.size)
      conditions.push({
        $or: [
          { sizes: tagPattern(req.query.size) },
          { tags: tagPattern(req.query.size) },
        ],
      });
    if (req.query.national)
      conditions.push({ national: String(req.query.national).toLowerCase() });
    if (req.query.style)
      conditions.push({
        $or: [
          { style: tagPattern(req.query.style) },
          { tags: tagPattern(req.query.style) },
        ],
      });
    if (req.query.medium)
      conditions.push({
        $or: [
          { medium: tagPattern(req.query.medium) },
          { tags: tagPattern(req.query.medium) },
        ],
      });
    if (req.query.collection) {
      const regex = new RegExp(escapeRegex(req.query.collection), "i");
      conditions.push({
        $or: [{ name: regex }, { description: regex }, { tags: regex }],
      });
    }
    if (req.query.status === "in-stock")
      conditions.push({ quantity: { $gt: 0 } });
    if (req.query.status === "pre-order")
      conditions.push({
        $or: [{ description: /pre/i }, { tags: "pre-order" }],
      });
    if (req.query.status === "limited")
      conditions.push({
        $or: [
          { description: /limited/i },
          { tags: { $in: ["limited", "collectible"] } },
        ],
      });
    if (req.query.thaiOnly === "true")
      conditions.push({
        national: "thailand",
        tags: { $nin: ["heritage", "craft", "thai-heritage"] },
      });

    if (conditions.length) filter.$and = conditions;
    const sort =
      req.query.sort === "price-asc"
        ? { price: 1, _id: 1 }
        : req.query.sort === "price-desc"
          ? { price: -1, _id: 1 }
          : { createdAt: -1, _id: -1 };
    const [products, total, artists] = await Promise.all([
      Product.find(filter)
        .select("-imageUrl -imageUrls")
        .populate("artist", "name profilePic")
        .populate("category", "name slug")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
      Artist.find().sort("name").select("name"),
    ]);
    res.json({
      success: true,
      products: products.map(serializeListProduct),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      facets: { artists: artists.map((artist) => artist.name) },
    });
  } catch (error) {
    next(error);
  }
};
exports.getPublicById = async (req, res, next) => {
  try {
    const product = mongoose.Types.ObjectId.isValid(req.params.id)
      ? await Product.findById(req.params.id)
          .populate("artist", "name profilePic")
          .populate("category", "name slug")
      : await Product.findOne({ code: req.params.id })
          .populate("artist", "name profilePic")
          .populate("category", "name slug");
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, product: serializeProduct(product) });
  } catch (error) {
    next(error);
  }
};
exports.getImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select("imageUrl");
    if (!product || !isStoredImage(product.imageUrl))
      return res.status(404).end();
    const match = product.imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return res.status(404).end();
    res
      .set("Cache-Control", "public, max-age=86400")
      .type(match[1])
      .send(Buffer.from(match[2], "base64"));
  } catch (error) {
    next(error);
  }
};
exports.list = async (req, res, next) => {
  try {
    const products = await Product.find()
      .select("-imageUrl -imageUrls")
      .populate("artist", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, products: products.map(serializeListProduct) });
  } catch (error) {
    next(error);
  }
};
exports.create = async (req, res, next) => {
  try {
    const input = removeDuplicateSingleImage(
      removeGeneratedImageReferences(pick(req.body)),
    );
    if (Array.isArray(input.imageUrls) && !input.imageUrl)
      input.imageUrl = input.imageUrls[0] || "";
    const product = await Product.create(input);
    await product.populate(["artist", "category"]);
    await logChange({
      action: "created",
      productId: product._id,
      productName: product.name,
      actor: req.user._id,
      after: snapshot(product),
    });
    res.status(201).json({ success: true, product: serializeProduct(product) });
  } catch (error) {
    next(error);
  }
};
exports.update = async (req, res, next) => {
  try {
    const before = await Product.findById(req.params.id);
    if (!before)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    const input = removeDuplicateSingleImage(
      removeGeneratedImageReferences(pick(req.body)),
    );
    if (Array.isArray(input.imageUrls) && !input.imageUrl)
      input.imageUrl = input.imageUrls[0] || "";
    const product = await Product.findByIdAndUpdate(req.params.id, input, {
      new: true,
      runValidators: true,
    }).populate("artist category");
    await logChange({
      action: "updated",
      productId: product._id,
      productName: product.name,
      actor: req.user._id,
      before: snapshot(before),
      after: snapshot(product),
    });
    res.json({ success: true, product: serializeProduct(product) });
  } catch (error) {
    next(error);
  }
};
exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    await logChange({
      action: "deleted",
      productId: product._id,
      productName: product.name,
      actor: req.user._id,
      before: snapshot(product),
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
exports.updateStock = async (req, res, next) => {
  try {
    const { operation, quantity } = req.body;
    const qty = Number(quantity);
    if (!["add", "subtract", "set"].includes(operation) || Number.isNaN(qty)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid operation or quantity" });
    }
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    if (operation === "add") {
      product.quantity += qty;
    } else if (operation === "subtract") {
      product.quantity = Math.max(0, product.quantity - qty);
    } else if (operation === "set") {
      product.quantity = Math.max(0, qty);
    }
    await product.save();
    await product.populate(["artist", "category"]);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};
