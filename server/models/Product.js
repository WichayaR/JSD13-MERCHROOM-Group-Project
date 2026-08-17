const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    date: Date,
    tags: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    imageUrl: String
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Product', ProductSchema);
