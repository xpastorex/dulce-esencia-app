const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Importamos nuestros middlewares de autenticación
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// ==========================================
// RUTAS DE PRODUCTOS
// ==========================================

// GET: Ver todos los productos (Cualquier usuario autenticado puede verlos)
router.get('/', verifyToken, productController.getAllProducts);

// POST: Crear un nuevo producto (SOLO ADMINISTRADORES)
router.post(
    '/', 
    verifyToken, // 1. Extrae y valida el JWT
    verifyRole('ADMINISTRATOR'), // 2. Verifica que req.user.role sea ADMINISTRATOR
    productController.createProduct // 3. Ejecuta la lógica de creación
);

module.exports = router;