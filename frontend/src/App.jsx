import { useAuth } from "./useAuth.js";
import Login from "./components/Login.jsx";
import GastosApp from "./GastosApp.jsx";

export default function App() {
  const { usuario, iniciarSesionLocal, cerrarSesion } = useAuth();

  if (!usuario) {
    return <Login onExito={iniciarSesionLocal} />;
  }

  return <GastosApp usuario={usuario} onCerrarSesion={cerrarSesion} />;
}
