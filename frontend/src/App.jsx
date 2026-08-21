import { useAuth } from "./useAuth.js";
import Login from "./components/Login.jsx";
import GastosApp from "./GastosApp.jsx";
import AvisoDemo from "./components/AvisoDemo.jsx";

export default function App() {
  const { usuario, iniciarSesionLocal, cerrarSesion } = useAuth();

  return (
    <>
      <AvisoDemo />
      {usuario ? (
        <GastosApp usuario={usuario} onCerrarSesion={cerrarSesion} />
      ) : (
        <Login onExito={iniciarSesionLocal} />
      )}
    </>
  );
}
