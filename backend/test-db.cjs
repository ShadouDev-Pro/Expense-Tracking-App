const pool = require("./data/db.js");

async function probarConexion() {
  try {
    const resultado = await pool.query("SELECT NOW()");
    console.log("✅ Conexión a PostgreSQL correcta");
    console.log("Hora del servidor:", resultado.rows[0].now);
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

probarConexion();