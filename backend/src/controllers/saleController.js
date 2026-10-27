const saleModel = require('../models/saleModel');

const getSalesHistory = async (req, res, next) => {
    try {
        const sales = await saleModel.getHistory();
        res.status(200).json({
            success: true,
            count: sales.length,
            data: sales
        });
    } catch (error) {
        next(error);
    }
};

const createSale = async (req, res, next) => {
    try {
        const { cart, payment_method_id } = req.body;
        
        // El ID del usuario viene de req.user (inyectado por el middleware verifyToken)
        const userId = req.user.id; 

        // Validaciones básicas
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ error: 'El carrito no puede estar vacío' });
        }

        if (!payment_method_id) {
            return res.status(400).json({ error: 'Debe especificar un método de pago válido' });
        }

        // Llamar a la transacción
        const saleId = await saleModel.createSaleTransaction(userId, payment_method_id, cart);

        res.status(201).json({
            success: true,
            message: 'Venta registrada con éxito',
            sale_id: saleId
        });
    } catch (error) {
        // Si tienes un constraint de CHECK en PostgreSQL (ej: stock >= 0),
        // aquí puedes capturar ese error específico y devolver un mensaje amigable.
        if (error.constraint === 'products_stock_check') {
            return res.status(400).json({ error: 'Stock insuficiente para concretar la venta' });
        }
        next(error);
    }
};

module.exports = {
    getSalesHistory,
    createSale
};