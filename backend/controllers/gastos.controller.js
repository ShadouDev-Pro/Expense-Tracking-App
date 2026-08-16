const { leerGastos, guardarGastos } = require("../data/db");

// Estado en memoria, cargado desde el archivo JSON al arrancar el servidor
let gastos = leerGastos();
let nextId = gastos.length > 0 ? Math.max(...gastos.map((g) => g.id)) + 1 : 1;

// Crear gasto
const crearGasto = (req, res) => {
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

  const nuevoGasto = {
    id: nextId++,
    descripcion,
    monto,
    categoria,
    fecha: new Date(),
    recurrente: Boolean(recurrente)
  };

  gastos.push(nuevoGasto);
  guardarGastos(gastos);

  res.status(201).json(nuevoGasto);
};

// Listar gastos (admite filtros opcionales por query string:
// ?categoria=Comida&desde=2026-01-01&hasta=2026-01-31&buscar=cafe)
const listarGastos = (req, res) => {
  const { categoria, desde, hasta, buscar } = req.query;
  let resultado = [...gastos];

  if (categoria) {
    resultado = resultado.filter(
      (g) => g.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  if (desde) {
    const fechaDesde = new Date(desde);
    resultado = resultado.filter((g) => new Date(g.fecha) >= fechaDesde);
  }

  if (hasta) {
    const fechaHasta = new Date(hasta);
    resultado = resultado.filter((g) => new Date(g.fecha) <= fechaHasta);
  }

  if (buscar) {
    const texto = buscar.toLowerCase();
    resultado = resultado.filter((g) =>
      g.descripcion.toLowerCase().includes(texto)
    );
  }

  res.json(resultado);
};

// Resumen: total general y total por categoría
const resumenGastos = (req, res) => {
  const total = gastos.reduce((acc, g) => acc + g.monto, 0);

  const porCategoria = gastos.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
    return acc;
  }, {});

  res.json({
    total,
    cantidadGastos: gastos.length,
    porCategoria
  });
};

// Gastos marcados como recurrentes (suscripciones, alquiler, etc.)
const gastosRecurrentes = (req, res) => {
  const recurrentes = gastos.filter((g) => g.recurrente);
  res.json(recurrentes);
};

// Exporta todos los gastos como CSV descargable
const exportarCSV = (req, res) => {
  const encabezado = "id,descripcion,monto,categoria,fecha,recurrente";
  const filas = gastos.map((g) =>
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
const obtenerGasto = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número"
    });
  }

  const gasto = gastos.find((g) => g.id === id);

  if (!gasto) {
    return res.status(404).json({
      error: "Gasto no encontrado"
    });
  }

  res.json(gasto);
};

// Actualizar gasto
const actualizarGasto = (req, res) => {
  const id = parseInt(req.params.id);
  const { descripcion, monto, categoria, recurrente } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número"
    });
  }

  const gasto = gastos.find((g) => g.id === id);

  if (!gasto) {
    return res.status(404).json({
      error: "Gasto no encontrado"
    });
  }

  if (descripcion !== undefined) gasto.descripcion = descripcion;
  if (monto !== undefined) gasto.monto = monto;
  if (categoria !== undefined) gasto.categoria = categoria;
  if (recurrente !== undefined) gasto.recurrente = Boolean(recurrente);

  guardarGastos(gastos);

  res.json(gasto);
};

// Eliminar gasto
const eliminarGasto = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número"
    });
  }

  const index = gastos.findIndex((g) => g.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Gasto no encontrado"
    });
  }

  gastos.splice(index, 1);
  guardarGastos(gastos);

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
