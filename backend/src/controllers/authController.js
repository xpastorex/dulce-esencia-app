const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Verificar si el usuario existe
        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Generar el JWT (Payload: id y rol del usuario)
        const payload = {
            id: user.id,
            role: user.role_name
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        // 4. Enviar respuesta (sin el password_hash)
        res.status(200).json({
            success: true,
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role_name
            }
        });

    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, role_id } = req.body;

        // Hashear la contraseña

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // guardar usuario en base de datos
        const newUser = await userModel.create(role_id, name, email, passwordHash);

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: newUser
        });
    } catch (error) {
        if (error.code === '23505') { // Código de error de Postgres para Unique Violation
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        next(error);
    }
};

module.exports = {
    login,
    register
};