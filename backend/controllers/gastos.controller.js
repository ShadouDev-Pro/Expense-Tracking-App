const {
  crearGasto: crearGastoDb,
  listarGastos: listarGastosDb,
  obtenerGastoPorId,
  actualizarGasto: actualizarGastoDb,
  eliminarGasto: eliminarGastoDb,
  resumenGastos: resumenGastosDb,
  gastosRecurrentes: gastosRecurrentesDb
} = require("../data/gastosDb");

// Crear gasto
const crearGasto = async (req, res) => {
  const { descripcion, monto, categoria, recurrente } = req.body;

  if (!descripcion || descripcion.trim() === "") {
    return res.status(400).json({
      error: "La descripción es obligatoria"
    });
  }

  if (monto === undefined || typeof monto !== "number") {
    return res.status(400).json({
      error: "El monto debe ser un número"
    });
  }

  if (monto <= 0) {
    return res.status(400).json({
      error: "El monto debe ser mayor a 0"
    });
  }

  if (!categoria || categoria.trim() === "") {
    return res.status(400).json({
      error: "La categoría es obligatoria"
    });
  }

  const nuevoGasto = await crearGastoDb(req.usuario.id, {
    descripcion,
    monto,
    categoria,
    recurrente
  });

  res.status(201).json(nuevoGasto);
};

// Listar gastos (admite filtros opcionales por query string)
const listarGastos = async (req, res) => {
  const { categoria, desde, hasta, buscar } = req.query;

  const resultado = await listarGastosDb(req.usuario.id, {
    categoria,
    desde,
    hasta,
    buscar
  });

  res.json(resultado);
};

// Resumen: total general y total por categoría
const resumenGastos = async (req, res) => {
  const resumen = await resumenGastosDb(req.usuario.id);
  res.json(resumen);
};

// Gastos marcados como recurrentes
const gastosRecurrentes = async (req, res) => {
  const recurrentes = await gastosRecurrentesDb(req.usuario.id);
  res.json(recurrentes);
};

// Exporta los gastos del usuario autenticado como CSV descargable
const exportarCSV = async (req, res) => {
  const gastosUsuario = await listarGastosDb(req.usuario.id, {});

  const encabezado = "id,descripcion,monto,categoria,fecha,recurrente";

  const filas = gastosUsuario.map((g) =>
    [
      g.id,
      `"${g.descripcion.replace(/"/g, '""')}"`,
      g.monto,
      `"${g.categoria.replace(/"/g, '""')}"`,
      new Date(g.fecha).toISOString(),
      g.recurrente ? "si" : "no"
    ].join(",")
  );

  const csv = [encabezado, ...filas].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="gastos_${new Date().toISOString().slice(0, 10)}.csv"`
  );

  res.send(csv);
};

// Obtener gasto
const obtenerGasto = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número"
    });
  }

  const gasto = await obtenerGastoPorId(id, req.usuario.id);

  if (!gasto) {
    return res.status(404).json({
      error: "Gasto no encontrado"
    });
  }

  res.json(gasto);
};

// Actualizar gasto
const actualizarGasto = async (req, res) => {
  const id = parseInt(req.params.id);
  const { descripcion, monto, categoria, recurrente } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número"
    });
  }

  const gasto = await actualizarGastoDb(id, req.usuario.id, {
    descripcion,
    monto,
    categoria,
    recurrente
  });

  if (!gasto) {
    return res.status(404).json({
      error: "Gasto no encontrado"
    });
  }

  res.json(gasto);
};

// Eliminar gasto
const eliminarGasto = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número"
    });
  }

  const eliminado = await eliminarGastoDb(id, req.usuario.id);

  if (!eliminado) {
    return res.status(404).json({
      error: "Gasto no encontrado"
    });
  }

  res.json({
    mensaje: "Gasto eliminado correctamente"
  });
};

module.exports = {
  crearGasto,
  listarGastos,
  resumenGastos,
  gastosRecurrentes,
  exportarCSV,
  obtenerGasto,
  actualizarGasto,
  eliminarGasto
};