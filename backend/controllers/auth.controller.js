const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { leerUsuarios, guardarUsuarios } = require("../data/usuariosDb");

const JWT_SECRET = process.env.JWT_SECRET || "clave-de-desarrollo-no-usar-en-produccion";
const EXPIRA_EN = "7d";

let usuarios = leerUsuarios();
let nextId = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id, usuario: usuario.usuario }, JWT_SECRET, {
    expiresIn: EXPIRA_EN
  });
}

// Registrar un nuevo usuario
const registrar = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || usuario.trim() === "") {
    return res.status(400).json({ error: "El usuario es obligatorio" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      error: "La contraseña debe tener al menos 6 caracteres"
    });
  }

  const yaExiste = usuarios.find(
    (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase()
  );

  if (yaExiste) {
    return res.status(409).json({ error: "Ese usuario ya existe" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const nuevoUsuario = {
    id: nextId++,
    usuario: usuario.trim(),
    passwordHash
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  const token = generarToken(nuevoUsuario);
  res.status(201).json({ token, usuario: nuevoUsuario.usuario });
};

// Iniciar sesión
const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
  }

  const encontrado = usuarios.find(
    (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase()
  );

  if (!encontrado) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }

  const coincide = await bcrypt.compare(password, encontrado.passwordHash);

  if (!coincide) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }

  const token = generarToken(encontrado);
  res.json({ token, usuario: encontrado.usuario });
};

module.exports = { registrar, login, JWT_SECRET };
