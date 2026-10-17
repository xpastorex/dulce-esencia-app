const jwt = require('jsonwebtoken');

// 1. Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    // Los tokens suelen enviarse en el header 'Authorization' con el formato 'Bearer <token>'
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    // Extraer solo el string del token
    const token = authHeader.split(' ')[1];

    try {
        // Verificar y decodificar el token usando tu clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Guardar los datos del usuario (id, role) en el objeto 'req'
        // Esto permite que el controlador sepa exactamente quién hizo la petición
        req.user = decoded; 
        
        // Pasar el control a la siguiente función (el controlador)
        next();
    } catch (error) {
        // Diferenciar si el token expiró o fue manipulado
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'El token ha expirado. Inicia sesión nuevamente.' });
        }
        return res.status(403).json({ error: 'Token inválido o corrupto.' });
    }
};

// 2. Middleware (Fábrica) para verificar roles específicos

const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        // Verificamos si el rol guardado en req.user coincide con el requerido
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ error: `Acceso denegado. Se requiere el rol: ${requiredRole}` });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    verifyRole
};