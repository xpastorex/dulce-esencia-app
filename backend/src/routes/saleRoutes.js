const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { verifyToken } = require('../middlewares/authMiddleware');

// GET /api/sales/history
router.get('/history', verifyToken, saleController.getSalesHistory);

module.exports = router;