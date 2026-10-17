require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./src/routes/authRoutes'); // <-- NUEVO: Importar rutas de auth

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Montar rutas
app.use('/api/auth', authRoutes); // <-- NUEVO: Montar las rutas en el prefijo /api/auth

// Manejador de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});