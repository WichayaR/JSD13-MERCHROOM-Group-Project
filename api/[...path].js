// Catch-all Vercel Function for the existing Express API. This makes
// POST /api/auth/login reach server/routes/auth.routes.js.
const app = require('../server/app');
const connectDB = require('../server/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('[api] Database connection failed:', error.message);
    return res.status(503).json({
      success: false,
      message: 'The service is temporarily unavailable.',
    });
  }
};
