const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    // ปรับชื่อฟิลด์จาก order_id เป็น orderId ให้ตรงกับข้อมูลที่ใช้รัน
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    // ปรับชื่อฟิลด์จาก payment_method เป็น method ให้ตรงกับข้อมูลที่ใช้รัน
    method: String,
    status: { type: String, default: 'pending' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Payment', PaymentSchema);
