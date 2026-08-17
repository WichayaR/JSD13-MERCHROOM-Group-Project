//ไฟล์โครงสร้างตารางข้อมูลลูกค้า เช่น ชื่อ อีเมล ที่อยู่จัดส่ง
// 🟢 โมเดล = ตารางใน MongoDB หลังต่อ DB แล้วจะไปสร้าง collection ชื่อ "users" ให้อัตโนมัติ
// วิธีใช้: const User = require('./User'); แล้วเรียก User.find(), User.create({...}) ฯลฯ

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    phone: String,
    interests: [String],
    address: String,
    paymentMethods: [String],
    profilePicture: String,
    socialAccounts: [String],
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    employeeId: String
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('User', UserSchema);
