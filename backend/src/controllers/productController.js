const productModel = require('../models/productModel');

// Función GET existente
const getAllProducts = async (req, res, next) => {
    try {
        const products = await productModel.findAll();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error); 
    }
};

// NUEVA: Función POST
const createProduct = async (req, res, next) => {
    try {
        // Extraemos los datos del body enviados por el frontend (Axios)
        const { 
            name, 
            category_id, 
            price, 
            stock = 0, // Por defecto 0 si no lo envían
            description = null, 
            barcode = null,
            image_url = null
        } = req.body;

        // 1. Validación Básica
        if (!name || !category_id || price === undefined) {
            return res.status(400).json({ 
                error: 'Faltan campos obligatorios: name, category_id, o price' 
            });
        }

        // 2. Formatear datos para el modelo
        const productData = {
            name,
            category_id,
            price,
            stock,
            description,
            barcode,
            image_url
        };

        // 3. Insertar en PostgreSQL (Llamando al modelo)
        const newProduct = await productModel.create(productData);

        // 4. Devolver la respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: newProduct
        });

    } catch (error) {
        // Manejo específico si el código de barra ya existe en la BD
        if (error.code === '23505' && error.constraint === 'products_barcode_key') {
            return res.status(400).json({ 
                error: 'Ya existe un producto con ese código de barras' 
            });
        }
        // Manejo específico si la categoría no existe (violación de llave foránea)
        if (error.code === '23503' && error.constraint === 'products_category_id_fkey') {
             return res.status(400).json({ 
                error: 'El ID de la categoría no existe' 
            });
        }
        
        // Pasar cualquier otro error genérico al middleware central
        next(error);
    }
};

module.exports = {
    getAllProducts,
    createProduct
};