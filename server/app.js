// Entry point หลักของ backend (Node.js / Express server)
// จัดการเชื่อมต่อฐานข้อมูล MongoDB และเปิด API routes สำหรับระบบ Merchroom
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./db');
const errorHandler = require('./middleware/errorHandler');

// นำเข้า Routes ทั้งหมด
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const promoRoutes = require('./routes/promo.routes');
const reviewRoutes = require('./routes/review.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');

const app = express();

// ตั้งค่า CORS สำหรับเชื่อมต่อกับ Frontend (Vite)
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development helper)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Merchroom API Server is running 🚀',
    categories: {
      ThaiHeritage: '/api/products?mainCategory=ThaiHeritage',
      PopCulture_Thailand: '/api/products?mainCategory=PopCulture&subCategory=Thailand',
      PopCulture_International: '/api/products?mainCategory=PopCulture&subCategory=International',
    },
    endpoints: [
      '/api/auth',
      '/api/admin',
      '/api/products',
      '/api/orders',
      '/api/promos',
      '/api/reviews',
      '/api/users',
      '/api/categories',
    ],
  });
});

// 404 Handler สำหรับ Route ที่ไม่มีอยู่
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

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
