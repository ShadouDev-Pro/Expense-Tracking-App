const express = require("express");
const router = express.Router();

const gastosController = require("../controllers/gastos.controller");
const verificarToken = require("../middleware/auth.middleware");

router.post("/", verificarToken, gastosController.crearGasto);
router.get("/", verificarToken, gastosController.listarGastos);
router.get("/resumen", verificarToken, gastosController.resumenGastos);
router.get("/recurrentes", verificarToken, gastosController.gastosRecurrentes);
router.get("/exportar-csv", verificarToken, gastosController.exportarCSV);
router.get("/:id", verificarToken, gastosController.obtenerGasto);
router.put("/:id", verificarToken, gastosController.actualizarGasto);
router.delete("/:id", verificarToken, gastosController.eliminarGasto);

module.exports = router;
