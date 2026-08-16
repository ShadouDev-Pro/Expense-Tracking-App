const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "gastos.json");

// Lee los gastos guardados en el archivo JSON.
// Si el archivo no existe todavía, devuelve un array vacío.
function leerGastos() {
  try {
    const contenido = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(contenido);
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

// Guarda el array de gastos completo en el archivo JSON.
function guardarGastos(gastos) {
  fs.writeFileSync(DB_PATH, JSON.stringify(gastos, null, 2), "utf-8");
}

module.exports = { leerGastos, guardarGastos };
