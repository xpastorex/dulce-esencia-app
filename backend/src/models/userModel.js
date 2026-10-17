const pool = require('../config/db');

const findByEmail = async (email) => {
    const query = `
        SELECT 
            u.id, 
            u.email, 
            u.password_hash, 
            u.name,
            r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1 AND u.is_active = true;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

const create = async (roleId, name, email, passwordHash) => {
    const query = `
        INSERT INTO users (role_id, name, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email; 
    `;
    

    const result = await pool.query(query, [roleId, name, email, passwordHash]);
    return result.rows[0];
};

module.exports = {
    findByEmail,
    create
};