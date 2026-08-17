// ไฟล์จั่วหัวเชื่อมต่อ MongoDB ตัวจริง มีแค่ไฟล์นี้ไฟล์เดียวในระบบที่ต่อฐานข้อมูล

// 🔧 เพิ่มบรรทัดนี้ไว้ "บนสุด" เพื่อให้ดึงค่าจากไฟล์ .env มาใช้งานได้
require('dotenv').config(); 

const mongoose = require('mongoose');
const dns = require('dns');

// 🔧 แก้ปัญหา DNS ของระบบปฏิเสธการสอบถามจาก Node (ECONNREFUSED)
// โดยบังคับให้สอบถาม DNS ผ่านเซิร์ฟเวอร์สาธารณะก่อนเชื่อมต่อ
dns.setServers(['8.8.8.8', '1.1.1.1']);

// ฟังก์ชันเปิดหัวเชื่อมต่อฐานข้อมูลตัวหลัก
const connectDB = async () => {
  try {
    // 🔌 
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('🍃 [DATABASE] MongoDB เชื่อมต่อสำเร็จแล้ว!');
  } catch (err) {
    console.error('❌ [DATABASE] เชื่อมต่อล้มเหลว:', err.message);
    process.exit(1); // สั่งปิดโปรแกรมทันทีหากต่อไม่ได้
  }
};

module.exports = connectDB; // ส่งออกฟังก์ชันเพื่อให้ไฟล์อื่นเรียกใช้ท่อเชื่อมต่อนี้
