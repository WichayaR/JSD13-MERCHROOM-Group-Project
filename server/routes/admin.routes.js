const express = require('express');
const { authUser } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');
const { getStats, getProductOptions } = require('../controllers/admin.controller');

const router = express.Router();
router.get('/stats', authUser, adminOnly, getStats);
router.get('/product-options', authUser, adminOnly, getProductOptions);

module.exports = router;
