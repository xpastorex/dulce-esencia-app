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

const createSaleTransaction = async (userId, paymentMethodId, cart) => {
    // 1. Obtener un cliente dedicado del pool para la transacción
    const client = await pool.connect();

    try {
        // 2. Iniciar la transacción
        await client.query('BEGIN');

        let totalItems = 0;
        let totalAmount = 0;

        // Calcular totales basados en el arreglo del carrito
        for (const item of cart) {
            totalItems += item.quantity;
            totalAmount += (item.price * item.quantity);
        }

        // 3. Insertar la Cabecera de la Venta
        const saleQuery = `
            INSERT INTO sales (user_id, payment_method_id, total_items, subtotal, total_amount)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        
        // Asumimos subtotal y total iguales (sin IVA separado por ahora)
        const saleValues = [userId, paymentMethodId, totalItems, totalAmount, totalAmount];
        const saleResult = await client.query(saleQuery, saleValues);
        const saleId = saleResult.rows[0].id;

        // 4. Preparar consultas para los detalles y el stock
        const detailQuery = `
            INSERT INTO sale_details (sale_id, product_id, quantity, unit_price, subtotal)
            VALUES ($1, $2, $3, $4, $5);
        `;
        const updateStockQuery = `module.exports = {
    getHistory
};
            UPDATE products 
            SET stock = stock - $1 
            WHERE id = $2;
        `;

        // 5. Iterar sobre cada producto del carrito
        for (const item of cart) {
            const itemSubtotal = item.price * item.quantity;

            // Insertar el detalle
            await client.query(detailQuery, [saleId, item.id, item.quantity, item.price, itemSubtotal]);

            // Restar el stock en el inventario
            await client.query(updateStockQuery, [item.quantity, item.id]);
        }

        // 6. Si todo salió bien, confirmar los cambios
        await client.query('COMMIT');
        return saleId;

    } catch (error) {
        // 7. Si ALGO falla (ej. stock negativo, ID no existe), cancelar TODO
        await client.query('ROLLBACK');
        throw error; // Lanzar el error al controlador
    } finally {
        // 8. Liberar siempre el cliente para que vuelva al pool, haya error o no
        client.release();
    }
};

module.exports = {
    getHistory,
    createSaleTransaction
};