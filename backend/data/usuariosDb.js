const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "usuarios.json");

// Lee los usuarios guardados: array de { id, usuario, passwordHash }
function leerUsuarios() {
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

function guardarUsuarios(usuarios) {
  fs.writeFileSync(DB_PATH, JSON.stringify(usuarios, null, 2), "utf-8");
}

module.exports = { leerUsuarios, guardarUsuarios };
