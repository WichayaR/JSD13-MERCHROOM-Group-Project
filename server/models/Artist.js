//ไฟล์โครงสร้างตารางข้อมูลศิลปิน ไม่ใช่ user เพราะศิลปินไม่ได้ login/สั่งซื้อ
// 🟢 โมเดล = ตารางใน MongoDB หลังต่อ DB แล้วจะไปสร้าง collection ชื่อ "artists" ให้อัตโนมัติ
// วิธีใช้: const Artist = require('./Artist'); แล้วเรียก Artist.find(), Artist.create({...}) ฯลฯ

const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    realName: String,
    // ประเภทของศิลปิน: solo = ศิลปินเดี่ยว, band = วงดนตรี, group = กลุ่ม/ไอดอล
    type: { type: String, enum: ['solo', 'band', 'group'], default: 'solo' },
    bio: String,
    style: String,
    socialLinks: [String],
    profilePic: String
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Artist', ArtistSchema);