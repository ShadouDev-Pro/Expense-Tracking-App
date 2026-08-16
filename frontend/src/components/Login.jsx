import { useState } from "react";
import { iniciarSesion, registrarUsuario } from "../api/auth.js";

export default function Login({ onExito }) {
  const [modo, setModo] = useState("iniciar"); // "iniciar" | "registrar"
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    try {
      const data =
        modo === "iniciar"
          ? await iniciarSesion(usuario, password)
          : await registrarUsuario(usuario, password);

      onExito(data.usuario, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="login-pantalla">
      <form className="tarjeta login-tarjeta" onSubmit={handleSubmit}>
        <h1>💰 Control de Gastos</h1>
        <p className="login-subtitulo">
          {modo === "iniciar" ? "Inicia sesión para continuar" : "Crea tu cuenta"}
        </p>

        {error && <p className="mensaje-error">{error}</p>}

        <div className="campo">
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ej. Solomeo Paredes"
            autoComplete="username"
          />
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={modo === "iniciar" ? "current-password" : "new-password"}
          />
        </div>

        <button
          type="submit"
          className="boton boton-primario boton-ancho"
          disabled={enviando}
        >
          {enviando
            ? "Cargando..."
            : modo === "iniciar"
            ? "Iniciar sesión"
            : "Crear cuenta"}
        </button>

        <button
          type="button"
          className="login-cambiar-modo"
          onClick={() => {
            setError("");
            setModo(modo === "iniciar" ? "registrar" : "iniciar");
          }}
        >
          {modo === "iniciar"
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </form>
    </div>
  );
}
