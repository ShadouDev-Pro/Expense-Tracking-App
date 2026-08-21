const pool = require("./db");

// Devuelve todos los presupuestos de un usuario como un objeto { categoria: limite }
async function obtenerPresupuestos(usuarioId) {
  const resultado = await pool.query(
    "SELECT categoria, limite FROM presupuestos WHERE usuario_id = $1",
    [usuarioId]
  );

  const presupuestos = {};
  for (const fila of resultado.rows) {
    presupuestos[fila.categoria] = Number(fila.limite);
  }

  return presupuestos;
}

// Crea el límite de una categoría si no existe, o lo actualiza si ya existía.
// Devuelve todos los presupuestos del usuario ya actualizados.
async function actualizarPresupuesto(usuarioId, categoria, limite) {
  const existente = await pool.query(
    "SELECT id FROM presupuestos WHERE usuario_id = $1 AND categoria = $2",
    [usuarioId, categoria]
  );

  if (existente.rows.length > 0) {
    await pool.query(
      "UPDATE presupuestos SET limite = $1 WHERE usuario_id = $2 AND categoria = $3",
      [limite, usuarioId, categoria]
    );
  } else {
    await pool.query(
      "INSERT INTO presupuestos (usuario_id, categoria, limite) VALUES ($1, $2, $3)",
      [usuarioId, categoria, limite]
    );
  }

  return obtenerPresupuestos(usuarioId);
}

// Elimina el presupuesto de una categoría. Devuelve true si existía, false si no
async function eliminarPresupuesto(usuarioId, categoria) {
  const resultado = await pool.query(
    "DELETE FROM presupuestos WHERE usuario_id = $1 AND categoria = $2",
    [usuarioId, categoria]
  );

  return resultado.rowCount > 0;
}

module.exports = { obtenerPresupuestos, actualizarPresupuesto, eliminarPresupuesto };