const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "presupuestos.json");

// Lee los presupuestos guardados: un objeto { categoria: limiteMensual }
function leerPresupuestos() {
  try {
    const contenido = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(contenido);
  } catch (err) {
    if (err.code === "ENOENT") {
      return {};
    }
    throw err;
  }
}

function guardarPresupuestos(presupuestos) {
  fs.writeFileSync(DB_PATH, JSON.stringify(presupuestos, null, 2), "utf-8");
}

module.exports = { leerPresupuestos, guardarPresupuestos };
