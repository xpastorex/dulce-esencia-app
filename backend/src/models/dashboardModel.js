const pool = require('../config/db');

const getStats = async () => {
    // 1. Ventas del día (Hoy)
    const ventasHoyQuery = `
        SELECT COALESCE(SUM(total), 0) as total
        FROM sales
        WHERE DATE(created_at) = CURRENT_DATE;
    `;

    // 2. Ventas del Mes
    const ventasMesQuery = `
        SELECT COALESCE(SUM(total), 0) as total
        FROM sales
        WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);
    `;

    // 3. Ticket Promedio del Día
    const ticketPromedioQuery = `
        SELECT COALESCE(AVG(total), 0) as promedio
        FROM sales
        WHERE DATE(created_at) = CURRENT_DATE;
    `;

    // 4. Productos en Stock Crítico (5 o menos unidades)
    const stockCriticoQuery = `
        SELECT COUNT(*) as count
        FROM products
        WHERE stock <= 5 AND is_active = true;
    `;

    // 5. Top 3 Productos más vendidos del mes
    const topProductosQuery = `
        SELECT 
            p.id, 
            p.name as nombre, 
            SUM(sd.quantity) as cantidad, 
            SUM(sd.subtotal) as total
        FROM sale_details sd
        JOIN sales s ON sd.sale_id = s.id
        JOIN products p ON sd.product_id = p.id
        WHERE EXTRACT(MONTH FROM s.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM s.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY p.id, p.name
        ORDER BY cantidad DESC
        LIMIT 3;
    `;

    // Ejecutar todas las consultas SQL de forma simultánea
    const [
        ventasHoyRes,
        ventasMesRes,
        ticketPromedioRes,
        stockCriticoRes,
        topProductosRes
    ] = await Promise.all([
        pool.query(ventasHoyQuery),
        pool.query(ventasMesQuery),
        pool.query(ticketPromedioQuery),
        pool.query(stockCriticoQuery),
        pool.query(topProductosQuery)
    ]);

    // Formatear y retornar los datos
    return {
        ventasHoy: parseFloat(ventasHoyRes.rows[0].total),
        ventasMes: parseFloat(ventasMesRes.rows[0].total),
        ticketPromedio: parseFloat(ticketPromedioRes.rows[0].promedio),
        stockCritico: parseInt(stockCriticoRes.rows[0].count, 10),
        topProductos: topProductosRes.rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            cantidad: parseInt(row.cantidad, 10),
            total: parseFloat(row.total)
        }))
    };
};

module.exports = {
    getStats
};