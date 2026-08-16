const express = require("express");
const router = express.Router();

const gastosController = require("../controllers/gastos.controller");

router.post("/", gastosController.crearGasto);
router.get("/", gastosController.listarGastos);
router.get("/resumen", gastosController.resumenGastos); // antes de /:id
router.get("/recurrentes", gastosController.gastosRecurrentes); // antes de /:id
router.get("/exportar-csv", gastosController.exportarCSV); // antes de /:id
router.get("/:id", gastosController.obtenerGasto);
router.put("/:id", gastosController.actualizarGasto);
router.delete("/:id", gastosController.eliminarGasto);

module.exports = router;
