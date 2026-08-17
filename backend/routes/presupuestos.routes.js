const express = require("express");
const router = express.Router();

const presupuestosController = require("../controllers/presupuestos.controller");
const verificarToken = require("../middleware/auth.middleware");

router.get("/", verificarToken, presupuestosController.obtenerPresupuestos);
router.put("/", verificarToken, presupuestosController.actualizarPresupuesto);
router.delete("/:categoria", verificarToken, presupuestosController.eliminarPresupuesto);

module.exports = router;
