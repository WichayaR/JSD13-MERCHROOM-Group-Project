// โมดูลจัดการเชื่อมต่อ MongoDB ด้วย Mongoose
require('dotenv').config(); 

const mongoose = require('mongoose');
const dns = require('dns');

// ฟิก DNS เป็น Google/Cloudflare ป้องกันบั๊ก ECONNREFUSED จาก MongoDB Atlas SRV บนเน็ตบางค่าย
dns.setServers(['8.8.8.8', '1.1.1.1']);

// ฟังก์ชันเชื่อมต่อฐานข้อมูล ถ้าต่อไม่สำเร็จให้ exit(1) ออกมาเลยเพื่อแจ้งเตือน
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🍃 [DATABASE] MongoDB connected successfully');
  } catch (err) {
    console.error('❌ [DATABASE] Connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
