const mongoose = require('mongoose'); 

const CartSchema = new mongoose.Schema({ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    
    items: [{ 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
        
        variant_id: mongoose.Schema.Types.ObjectId, 
        quantity: { type: Number, default: 1 } 
    }]
}, { 
    // ใส่ไว้เพื่อสั่งให้ระบบสร้างช่องเก็บเวลา 'createdAt' และ 'updatedAt' ให้เราอัตโนมัติ
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } 
}); 

module.exports = mongoose.model('Cart', CartSchema);
