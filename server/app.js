// Entry point หลักของ backend (Node.js / Express server)
// จัดการเชื่อมต่อฐานข้อมูล MongoDB และเปิด API routes สำหรับระบบ Merchroom
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./db');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(
  cors({
    // Vite ปกติใช้ 5173 แต่ถ้า port ชนจะเด้งไป 5174 อัตโนมัติ จึงอนุญาตทั้งสอง port
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      // Set CLIENT_ORIGIN in Vercel when the client and API use different origins.
      process.env.CLIENT_ORIGIN,
    ].filter(Boolean),
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

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

// Vercel imports this module as a serverless function. Only start a listener
// when this file is executed directly during local development.
if (require.main === module) {
  start();
}

module.exports = app;
