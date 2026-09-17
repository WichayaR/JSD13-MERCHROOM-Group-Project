const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Artist = require('../models/Artist');

exports.getStats = async (req, res, next) => {
  try {
    const [revenue, totalOrders, totalProducts, lowStock, revenueTrend, salesByCategory, recentOrders] = await Promise.all([
      Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.countDocuments(),
      Product.countDocuments(),
      Product.find({ quantity: { $lte: 10 } }).populate('artist', 'name').sort({ quantity: 1 }).limit(6),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: { year: { $year: { $ifNull: ['$purchaseDate', '$createdAt'] } }, month: { $month: { $ifNull: ['$purchaseDate', '$createdAt'] } } }, revenue: { $sum: '$totalAmount' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }, { $limit: 12 },
        { $project: { _id: 0, month: { $dateToString: { format: '%b', date: { $dateFromParts: { year: '$_id.year', month: '$_id.month' } } } }, revenue: 1 } },
      ]),
      Order.aggregate([
        { $unwind: '$items' }, { $lookup: { from: 'products', localField: 'items.productId', foreignField: '_id', as: 'product' } },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }, { $lookup: { from: 'categories', localField: 'product.category', foreignField: '_id', as: 'category' } },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $group: { _id: { $ifNull: ['$category.name', 'Uncategorised'] }, value: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
        { $project: { _id: 0, name: '$_id', value: 1 } }, { $sort: { value: -1 } },
      ]),
      Order.find().populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).limit(6),
    ]);
    res.json({ success: true, stats: { totalRevenue: revenue[0]?.total || 0, totalOrders, totalProducts, lowStockCount: lowStock.length }, revenueTrend, salesByCategory, lowStock, recentOrders });
  } catch (error) { next(error); }
};

exports.getProductOptions = async (req, res, next) => {
  try {
    const [categories, artists] = await Promise.all([Category.find().sort('name').select('name'), Artist.find().sort('name').select('name')]);
    res.json({ success: true, categories, artists });
  } catch (error) { next(error); }
};
