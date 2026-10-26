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

module.exports = {
    getSalesHistory
};