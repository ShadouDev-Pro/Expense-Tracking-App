const pool = require("./db");

// Convierte una fila de la base de datos al formato que usa el resto de la app
// (sobre todo, pasa "monto" de string a number)
function mapearGasto(fila) {
  return {
    ...fila,
    monto: Number(fila.monto)
  };
}

// Crea un gasto nuevo para un usuario y devuelve la fila creada
async function crearGasto(usuarioId, { descripcion, monto, categoria, recurrente }) {
  const resultado = await pool.query(
    `INSERT INTO gastos (usuario_id, descripcion, monto, categoria, fecha, recurrente)
     VALUES ($1, $2, $3, $4, NOW(), $5)
     RETURNING id, usuario_id, descripcion, monto, categoria, fecha, recurrente`,
    [usuarioId, descripcion, monto, categoria, Boolean(recurrente)]
  );

  return mapearGasto(resultado.rows[0]);
}

// Lista los gastos de un usuario, aplicando filtros opcionales
async function listarGastos(usuarioId, { categoria, desde, hasta, buscar } = {}) {
  const condiciones = ["usuario_id = $1"];
  const valores = [usuarioId];

  if (categoria) {
    valores.push(categoria);
    condiciones.push(`LOWER(categoria) = LOWER($${valores.length})`);
  }

  if (desde) {
    valores.push(desde);
    condiciones.push(`fecha >= $${valores.length}`);
  }

  if (hasta) {
    valores.push(hasta);
    condiciones.push(`fecha <= $${valores.length}`);
  }

  if (buscar) {
    valores.push(`%${buscar}%`);
    condiciones.push(`descripcion ILIKE $${valores.length}`);
  }

  const consulta = `
    SELECT id, usuario_id, descripcion, monto, categoria, fecha, recurrente
    FROM gastos
    WHERE ${condiciones.join(" AND ")}
    ORDER BY fecha DESC
  `;

  const resultado = await pool.query(consulta, valores);
  return resultado.rows.map(mapearGasto);
}

// Devuelve un único gasto si pertenece al usuario, o null si no existe
async function obtenerGastoPorId(id, usuarioId) {
  const resultado = await pool.query(
    "SELECT id, usuario_id, descripcion, monto, categoria, fecha, recurrente FROM gastos WHERE id = $1 AND usuario_id = $2",
    [id, usuarioId]
  );

  return resultado.rows[0] ? mapearGasto(resultado.rows[0]) : null;
}

// Actualiza solo los campos indicados y devuelve el gasto actualizado, o null si no existe
async function actualizarGasto(id, usuarioId, cambios) {
  const existente = await obtenerGastoPorId(id, usuarioId);
  if (!existente) return null;

  const descripcion = cambios.descripcion !== undefined ? cambios.descripcion : existente.descripcion;
  const monto = cambios.monto !== undefined ? cambios.monto : existente.monto;
  const categoria = cambios.categoria !== undefined ? cambios.categoria : existente.categoria;
  const recurrente = cambios.recurrente !== undefined ? Boolean(cambios.recurrente) : existente.recurrente;

  const resultado = await pool.query(
    `UPDATE gastos
     SET descripcion = $1, monto = $2, categoria = $3, recurrente = $4
     WHERE id = $5 AND usuario_id = $6
     RETURNING id, usuario_id, descripcion, monto, categoria, fecha, recurrente`,
    [descripcion, monto, categoria, recurrente, id, usuarioId]
  );

  return mapearGasto(resultado.rows[0]);
}

// Elimina un gasto. Devuelve true si se borró, false si no existía
async function eliminarGasto(id, usuarioId) {
  const resultado = await pool.query(
    "DELETE FROM gastos WHERE id = $1 AND usuario_id = $2",
    [id, usuarioId]
  );

  return resultado.rowCount > 0;
}

// Calcula el total y el desglose por categoría de un usuario
async function resumenGastos(usuarioId) {
  const totalResultado = await pool.query(
    "SELECT COALESCE(SUM(monto), 0) AS total, COUNT(*) AS cantidad FROM gastos WHERE usuario_id = $1",
    [usuarioId]
  );

  const porCategoriaResultado = await pool.query(
    "SELECT categoria, SUM(monto) AS total FROM gastos WHERE usuario_id = $1 GROUP BY categoria",
    [usuarioId]
  );

  const porCategoria = {};
  for (const fila of porCategoriaResultado.rows) {
    porCategoria[fila.categoria] = Number(fila.total);
  }

  return {
    total: Number(totalResultado.rows[0].total),
    cantidadGastos: Number(totalResultado.rows[0].cantidad),
    porCategoria
  };
}

// Devuelve los gastos marcados como recurrentes
async function gastosRecurrentes(usuarioId) {
  const resultado = await pool.query(
    "SELECT id, usuario_id, descripcion, monto, categoria, fecha, recurrente FROM gastos WHERE usuario_id = $1 AND recurrente = true",
    [usuarioId]
  );

  return resultado.rows.map(mapearGasto);
}

module.exports = {
  crearGasto,
  listarGastos,
  obtenerGastoPorId,
  actualizarGasto,
  eliminarGasto,
  resumenGastos,
  gastosRecurrentes
};