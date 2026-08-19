import { obtenerToken, cerrarSesion } from "./auth.js";

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/gastos`;
const PRESUPUESTOS_URL = `${import.meta.env.VITE_API_URL || ""}/api/presupuestos`;

function cabeceras(conJson = true) {
  const cabecerasBase = {};
  if (conJson) cabecerasBase["Content-Type"] = "application/json";

  const token = obtenerToken();
  if (token) cabecerasBase["Authorization"] = `Bearer ${token}`;

  return cabecerasBase;
}

async function manejarRespuesta(res) {
  if (res.status === 401) {
    // El token no es válido o ha caducado: cerramos la sesión local
    // y avisamos a la app para que vuelva a la pantalla de login.
    cerrarSesion();
    window.dispatchEvent(new Event("sesion-expirada"));
    throw new Error("Tu sesión ha caducado. Vuelve a iniciar sesión.");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Error en la petición");
  }
  return data;
}

export async function obtenerGastos(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.categoria) params.append("categoria", filtros.categoria);
  if (filtros.desde) params.append("desde", filtros.desde);
  if (filtros.hasta) params.append("hasta", filtros.hasta);
  if (filtros.buscar) params.append("buscar", filtros.buscar);

  const query = params.toString();
  const res = await fetch(`${API_URL}${query ? `?${query}` : ""}`, {
    headers: cabeceras(false)
  });
  return manejarRespuesta(res);
}

export async function obtenerResumen() {
  const res = await fetch(`${API_URL}/resumen`, { headers: cabeceras(false) });
  return manejarRespuesta(res);
}

export async function obtenerGastosRecurrentes() {
  const res = await fetch(`${API_URL}/recurrentes`, {
    headers: cabeceras(false)
  });
  return manejarRespuesta(res);
}

export function urlExportarCSV() {
  // Como es una descarga vía enlace directo, el token va como query param
  // (el navegador no puede añadir cabeceras a una navegación normal).
  const token = obtenerToken();
  return `${API_URL}/exportar-csv?token=${encodeURIComponent(token || "")}`;
}

export async function crearGasto(gasto) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: cabeceras(),
    body: JSON.stringify(gasto)
  });
  return manejarRespuesta(res);
}

export async function actualizarGasto(id, gasto) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: cabeceras(),
    body: JSON.stringify(gasto)
  });
  return manejarRespuesta(res);
}

export async function eliminarGasto(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: cabeceras(false)
  });
  return manejarRespuesta(res);
}

// --- Presupuestos por categoría ---

export async function obtenerPresupuestos() {
  const res = await fetch(PRESUPUESTOS_URL, { headers: cabeceras(false) });
  return manejarRespuesta(res);
}

export async function guardarPresupuesto(categoria, limite) {
  const res = await fetch(PRESUPUESTOS_URL, {
    method: "PUT",
    headers: cabeceras(),
    body: JSON.stringify({ categoria, limite })
  });
  return manejarRespuesta(res);
}

export async function eliminarPresupuesto(categoria) {
  const res = await fetch(
    `${PRESUPUESTOS_URL}/${encodeURIComponent(categoria)}`,
    { method: "DELETE", headers: cabeceras(false) }
  );
  return manejarRespuesta(res);
}
