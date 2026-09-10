// Entry point หลักของ backend (Node.js)
const connectDB = require('./db');

// สั่งเชื่อมต่อ MongoDB ทันทีตอน start server
connectDB();

// โมเดลต่างๆ (User, Product ฯลฯ) สามารถ require มาเรียกใช้ query ได้ทันที
// ตัวอย่าง: const User = require('./models/User'); const users = await User.find();

console.log('Server is running and connecting to MongoDB...');
