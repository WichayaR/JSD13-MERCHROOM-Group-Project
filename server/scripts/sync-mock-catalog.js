// Synchronise the frontend product mock catalog to MongoDB without touching
// customer-created products, users, carts, payments, or orders.
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const mongoose = require("mongoose");
const connectDB = require("../db");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Artist = require("../models/Artist");

const projectRoot = path.resolve(__dirname, "..", "..");
const mockCatalogPath = path.join(
  projectRoot,
  "client",
  "src",
  "data",
  "product.js",
);
const assetRoots = ["Thai", "Eng", "Heritage"].map((folder) =>
  path.join(projectRoot, "client", "assets", folder),
);

function loadMockProducts() {
  const source = fs.readFileSync(mockCatalogPath, "utf8");
  const catalogSource = source.slice(source.indexOf("export const products ="));
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    `function img(fileName) { return fileName; };${catalogSource.replace("export const products =", "globalThis.products =")}`,
    sandbox,
  );
  return sandbox.products;
}

function findAsset(fileName) {
  const filePath = assetRoots
    .map((root) => path.join(root, fileName))
    .find(fs.existsSync);
  if (!filePath) throw new Error(`Catalog image not found: ${fileName}`);
  return filePath;
}

function imageDataUrl(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const mimeType =
    extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/png";
  return `data:${mimeType};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function categorySlugFor(product) {
  if (product.id === "03th") return "hat";
  if (product.medium === "T-Shirt") return "apparel";
  if (product.medium === "Vinyl") return "album";
  return "fanmerch";
}

function genreTagFor(product) {
  if (product.id.endsWith("hr")) return "genre:handicraft";
  if (product.medium === "Vinyl") return "genre:collectibles";
  if (product.medium === "Home & Living") return "genre:home";
  if (product.medium === "Accessories") {
    return /bag|tote|clutch|กระเป๋า/i.test(product.name)
      ? "genre:bags"
      : "genre:accessories";
  }
  return "genre:apparel";
}

async function syncMockCatalog({ connect = true } = {}) {
  if (connect) await connectDB();

  const [categories, artists] = await Promise.all([
    Category.find().lean(),
    Artist.find().lean(),
  ]);
  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const artistByName = new Map(artists.map((artist) => [artist.name, artist]));
  const summary = { inserted: [], updated: [], skipped: [] };

  for (const mockProduct of loadMockProducts()) {
    const category = categoryBySlug.get(categorySlugFor(mockProduct));
    const artist = artistByName.get(mockProduct.brand);
    if (!category || !artist) {
      summary.skipped.push({
        name: mockProduct.name,
        reason: !category ? "missing category" : "missing artist",
      });
      continue;
    }

    const imageUrl = imageDataUrl(findAsset(mockProduct.image));
    const tags = [
      ...new Set([...(mockProduct.tags || []), genreTagFor(mockProduct)]),
    ];
    const catalogFields = {
      description: mockProduct.description,
      price: mockProduct.price,
      national: mockProduct.national,
      style: mockProduct.style,
      medium: mockProduct.medium,
      sizes: mockProduct.sizes || [],
      tags,
      category: category._id,
      artist: artist._id,
      imageUrl,
      imageFit: "cover",
    };
    const existing = await Product.findOne({
      name: mockProduct.name,
      artist: artist._id,
    })
      .select("_id")
      .lean();

    if (existing) {
      // Do not reset quantity: the live value changes when an order is made.
      await Product.updateOne({ _id: existing._id }, { $set: catalogFields });
      summary.updated.push(mockProduct.name);
    } else {
      await Product.create({
        name: mockProduct.name,
        quantity: 25,
        ...catalogFields,
      });
      summary.inserted.push(mockProduct.name);
    }
  }

  return summary;
}

module.exports = { syncMockCatalog };

if (require.main === module) {
  syncMockCatalog()
    .then((summary) => console.log(JSON.stringify(summary, null, 2)))
    .catch((error) => {
      console.error("[ERROR] Catalog sync failed:", error.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}
