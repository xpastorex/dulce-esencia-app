const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/history', verifyToken, saleController.getSalesHistory);

router.post('/', verifyToken, saleController.createSale);

module.exports = router;