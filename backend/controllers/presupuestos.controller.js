const {
  leerPresupuestos,
  guardarPresupuestos
} = require("../data/presupuestosDb");

let presupuestos = leerPresupuestos(); // { "Comida": 200, "Transporte": 50 }

// Obtener todos los presupuestos
const obtenerPresupuestos = (req, res) => {
  res.json(presupuestos);
};

// Crear o actualizar el límite de una categoría
const actualizarPresupuesto = (req, res) => {
  const { categoria, limite } = req.body;

  if (!categoria || categoria.trim() === "") {
    return res.status(400).json({
      error: "La categoría es obligatoria"
    });
  }

  if (limite === undefined || typeof limite !== "number" || limite < 0) {
    return res.status(400).json({
      error: "El límite debe ser un número mayor o igual a 0"
    });
  }

  presupuestos[categoria] = limite;
  guardarPresupuestos(presupuestos);

  res.json(presupuestos);
};

// Eliminar el presupuesto de una categoría
const eliminarPresupuesto = (req, res) => {
  const { categoria } = req.params;

  if (!(categoria in presupuestos)) {
    return res.status(404).json({
      error: "No hay presupuesto definido para esa categoría"
    });
  }

  delete presupuestos[categoria];
  guardarPresupuestos(presupuestos);

  res.json({ mensaje: "Presupuesto eliminado correctamente" });
};

module.exports = {
  obtenerPresupuestos,
  actualizarPresupuesto,
  eliminarPresupuesto
};
