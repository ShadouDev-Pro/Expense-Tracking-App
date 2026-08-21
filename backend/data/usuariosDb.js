const pool = require("./db");

// Busca un usuario por su nombre. Devuelve la fila si existe, o null si no.
async function buscarUsuarioPorNombre(usuario) {
  const resultado = await pool.query(
    "SELECT id, usuario, password_hash FROM usuarios WHERE LOWER(usuario) = LOWER($1)",
    [usuario]
  );

  return resultado.rows[0] || null;
}

// Crea un usuario nuevo y devuelve la fila insertada (con su id ya generado)
async function crearUsuario(usuario, passwordHash) {
  const resultado = await pool.query(
    "INSERT INTO usuarios (usuario, password_hash) VALUES ($1, $2) RETURNING id, usuario, password_hash",
    [usuario, passwordHash]
  );

  return resultado.rows[0];
}

module.exports = { buscarUsuarioPorNombre, crearUsuario };
