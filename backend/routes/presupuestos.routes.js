const express = require("express");
const router = express.Router();

const presupuestosController = require("../controllers/presupuestos.controller");

router.get("/", presupuestosController.obtenerPresupuestos);
router.put("/", presupuestosController.actualizarPresupuesto);
router.delete("/:categoria", presupuestosController.eliminarPresupuesto);

module.exports = router;
