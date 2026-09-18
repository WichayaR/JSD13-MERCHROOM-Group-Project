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

const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  app.set('trust proxy', 1);
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://merchroom.vercel.app',
  process.env.CLIENT_URL,
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
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
