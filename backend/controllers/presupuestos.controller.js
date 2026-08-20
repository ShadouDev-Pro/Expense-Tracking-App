const {
  obtenerPresupuestos: obtenerPresupuestosDb,
  actualizarPresupuesto: actualizarPresupuestoDb,
  eliminarPresupuesto: eliminarPresupuestoDb
} = require("../data/presupuestosDb");

// Obtener todos los presupuestos
const obtenerPresupuestos = async (req, res) => {
  const usuarioId = req.usuario.id;

  const presupuestosUsuario = await obtenerPresupuestosDb(usuarioId);

  res.json(presupuestosUsuario);
};

// Crear o actualizar el límite de una categoría
const actualizarPresupuesto = async (req, res) => {
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

  const usuarioId = req.usuario.id;

  const presupuestosActualizados = await actualizarPresupuestoDb(
    usuarioId,
    categoria,
    limite
  );

  res.json(presupuestosActualizados);
};

// Eliminar el presupuesto de una categoría
const eliminarPresupuesto = async (req, res) => {
  const { categoria } = req.params;
  const usuarioId = req.usuario.id;

  const eliminado = await eliminarPresupuestoDb(usuarioId, categoria);

  if (!eliminado) {
    return res.status(404).json({
      error: "No hay presupuesto definido para esa categoría"
    });
  }

  res.json({ mensaje: "Presupuesto eliminado correctamente" });
};

module.exports = {
  obtenerPresupuestos,
  actualizarPresupuesto,
  eliminarPresupuesto
};
