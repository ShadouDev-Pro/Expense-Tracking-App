const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "clave-de-desarrollo-no-usar-en-produccion";

function verificarToken(req, res, next) {
  const cabecera = req.headers.authorization;
  let token = null;

  if (cabecera && cabecera.startsWith("Bearer ")) {
    token = cabecera.split(" ")[1];
  } else if (req.query.token) {
    // Para enlaces de descarga directa (ej. exportar CSV), donde el
    // navegador no puede añadir cabeceras personalizadas.
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: "No autenticado" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sesión no válida o expirada" });
  }
}

module.exports = verificarToken;
