const dashboardModel = require('../models/dashboardModel');

const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await dashboardModel.getStats();
        
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats
};