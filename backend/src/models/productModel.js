const pool = require('../config/db');

const findAll = async () => {
    const query = `
        SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.barcode,
        p.image_url,
        c.name as category_name
    FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true
        ORDER BY p.name ASC;
    `;
    
    const result = await pool.query(query);
    return result.rows;
};

const create = async (productData) => {
    const query = `
        INSERT INTO products (category_id, name, description, price, stock, barcode, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [
        productData.category_id, 
        productData.name, 
        productData.description, 
        productData.price, 
        productData.stock,
        productData.barcode,
        productData.image_url
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    findAll,
    create
};