const { Pool } = require("pg");


const usaConexionRemota = Boolean(process.env.DATABASE_URL);

const pool = usaConexionRemota
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 10
    });

module.exports = pool;