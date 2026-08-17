const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // ดึงฟิลด์ทั้งหมดจากไฟล์ OrderItem มาฝังไว้ในนี้เลย
    items: [{
        _id: mongoose.Schema.Types.ObjectId,
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    shippingProvider: String,
    shippingAddress: String,
    purchaseDate: Date
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Order', OrderSchema);
