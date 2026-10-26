const pool = require('../config/db');

const getHistory = async () => {
    const query = `
        SELECT 
            s.id as sale_id,
            s.total_items,
            s.subtotal,
            s.total,
            s.created_at as sale_date,
            u.name as cashier_name,
            pm.name as payment_method_name,
            (
                SELECT json_agg(json_build_object(
                    'product_id', sd.product_id,
                    'product_name', p.name,
                    'quantity', sd.quantity,
                    'unit_price', sd.unit_price,
                    'subtotal', sd.subtotal
                ))
                FROM sale_details sd
                JOIN products p ON sd.product_id = p.id
                WHERE sd.sale_id = s.id
            ) as details
        FROM sales s
        JOIN users u ON s.user_id = u.id
        JOIN payment_methods pm ON s.payment_method_id = pm.id
        ORDER BY s.created_at DESC;
    `;
    
    const result = await pool.query(query);
    return result.rows;
};

module.exports = {
    getHistory
};