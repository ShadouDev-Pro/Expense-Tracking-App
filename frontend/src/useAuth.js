import { useEffect, useState, useCallback } from "react";
import {
  obtenerToken,
  obtenerUsuarioGuardado,
  cerrarSesion as cerrarSesionApi
} from "./api/auth.js";

export function useAuth() {
  const [usuario, setUsuario] = useState(() => {
    const token = obtenerToken();
    const nombre = obtenerUsuarioGuardado();
    return token && nombre ? { nombre, token } : null;
  });

  // Si el backend responde 401 en cualquier petición, la propia API
  // dispara este evento para forzar la vuelta a la pantalla de login.
  useEffect(() => {
    const handleSesionExpirada = () => setUsuario(null);
    window.addEventListener("sesion-expirada", handleSesionExpirada);
    return () =>
      window.removeEventListener("sesion-expirada", handleSesionExpirada);
  }, []);

  const iniciarSesionLocal = useCallback((nombre, token) => {
    setUsuario({ nombre, token });
  }, []);

  const cerrarSesion = useCallback(() => {
    cerrarSesionApi();
    setUsuario(null);
  }, []);

  return { usuario, cargando: false, iniciarSesionLocal, cerrarSesion };
}
