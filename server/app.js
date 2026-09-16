// Entry point หลักของ backend (Node.js / Express server)
// จัดการเชื่อมต่อฐานข้อมูล MongoDB และเปิด API routes สำหรับระบบ Merchroom

//----------โหลดค่าจาก server/.env ใช้ MONGO_URI สำหรับ MongoDB และ JWT_SECRET สำหรับ JWT ------------*

require('dotenv').config();

const express = require('express');

//-------อนุญาต frontend ที่ localhost:5173, 5174, 5175 
// credentials: true ทำให้ browser ส่ง httpOnly cookie accessToken ไปกับ API ได้ --------*
const cors = require('cors'); 

// middleware จากแพ็กเกจ cookie-parser ที่เรา import เอง:
const cookieParser = require('cookie-parser');

const connectDB = require('./db');
const authRoutes = require('./routes/auth.routes');

//เพิ่ม routes ฝั่ง admin 
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(
  cors({
    // Vite ปกติใช้ 5173 แต่ถ้า port ชนจะเด้งไป 5174 อัตโนมัติ จึงอนุญาตทั้งสอง port
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  }),
);

//แล้วลงทะเบียนด้วย 
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Merchroom server is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[server error]', err.message);
  return res.status(500).json({ success: false, message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`[SERVER] Merchroom backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[SERVER] Failed to start:', err.message);
    process.exit(1);
  }
}

start();