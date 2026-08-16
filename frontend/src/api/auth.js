const AUTH_URL = "http://localhost:3000/api/auth";

const CLAVE_TOKEN = "gastos_token";
const CLAVE_USUARIO = "gastos_usuario";

async function manejarRespuesta(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Error en la petición");
  }
  return data;
}

export async function registrarUsuario(usuario, password) {
  const res = await fetch(`${AUTH_URL}/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password })
  });
  const data = await manejarRespuesta(res);
  guardarSesion(data.token, data.usuario);
  return data;
}

export async function iniciarSesion(usuario, password) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password })
  });
  const data = await manejarRespuesta(res);
  guardarSesion(data.token, data.usuario);
  return data;
}

export function guardarSesion(token, usuario) {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, usuario);
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function obtenerUsuarioGuardado() {
  return localStorage.getItem(CLAVE_USUARIO);
}
