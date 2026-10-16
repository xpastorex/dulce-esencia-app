require('dotenv').config();
const { Pool } = require('pg');

// Puedes configurar el Pool para aceptar tanto una URL de conexión como parámetros sueltos
const poolConfig = process.env.DATABASE_URL 
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // A menudo necesario para conexiones en la nube
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    };

const pool = new Pool(poolConfig);

module.exports = pool;