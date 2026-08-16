import { useEffect, useState, useCallback } from "react";
import GastoForm from "./components/GastoForm.jsx";
import GastoList from "./components/GastoList.jsx";
import ResumenCategorias from "./components/ResumenCategorias.jsx";
import GraficaMensual from "./components/GraficaMensual.jsx";
import GastosRecurrentes from "./components/GastosRecurrentes.jsx";
import Presupuestos from "./components/Presupuestos.jsx";
import {
  obtenerGastos,
  obtenerResumen,
  obtenerGastosRecurrentes,
  urlExportarCSV,
  crearGasto,
  actualizarGasto,
  eliminarGasto,
  obtenerPresupuestos,
  guardarPresupuesto,
  eliminarPresupuesto
} from "./api/gastos.js";

export default function GastosApp({ usuario, onCerrarSesion }) {
  const [vista, setVista] = useState("gastos"); // "gastos" | "estadisticas"
  const [gastos, setGastos] = useState([]);
  const [todosGastos, setTodosGastos] = useState([]); // sin filtrar, para la gráfica
  const [resumen, setResumen] = useState(null);
  const [recurrentes, setRecurrentes] = useState([]);
  const [presupuestos, setPresupuestos] = useState({});
  const [gastoEditando, setGastoEditando] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const cargarDatos = useCallback(async () => {
    try {
      setErrorCarga("");
      const filtros = {};
      if (filtroCategoria) filtros.categoria = filtroCategoria;
      if (filtroTexto) filtros.buscar = filtroTexto;

      const hayFiltros = Boolean(filtroCategoria || filtroTexto);
      const peticiones = [
        obtenerGastos(filtros),
        obtenerResumen(),
        obtenerGastosRecurrentes(),
        obtenerPresupuestos()
      ];
      if (hayFiltros) peticiones.push(obtenerGastos({}));

      const [listaGastos, datosResumen, listaRecurrentes, datosPresupuestos, listaCompleta] =
        await Promise.all(peticiones);

      setGastos(listaGastos);
      setResumen(datosResumen);
      setRecurrentes(listaRecurrentes);
      setPresupuestos(datosPresupuestos);
      setTodosGastos(hayFiltros ? listaCompleta : listaGastos);
    } catch (err) {
      setErrorCarga(
        "No se pudo conectar con la API. ¿Está el backend corriendo en el puerto 3000?"
      );
    } finally {
      setCargando(false);
    }
  }, [filtroCategoria, filtroTexto]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleGuardar = async (datos) => {
    if (gastoEditando) {
      await actualizarGasto(gastoEditando.id, datos);
      setGastoEditando(null);
    } else {
      await crearGasto(datos);
    }
    await cargarDatos();
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este gasto?")) return;
    await eliminarGasto(id);
    await cargarDatos();
  };

  const handleRegistrarRecurrente = async (plantilla) => {
    await crearGasto(plantilla);
    await cargarDatos();
  };

  const handleGuardarPresupuesto = async (categoria, limite) => {
    await guardarPresupuesto(categoria, limite);
    await cargarDatos();
  };

  const handleEliminarPresupuesto = async (categoria) => {
    await eliminarPresupuesto(categoria);
    await cargarDatos();
  };

  const categoriasDisponibles = resumen
    ? Object.keys(resumen.porCategoria)
    : [];

  return (
    <div className="contenedor">
      <header className="cabecera">
        <h1>💰 Control de Gastos</h1>
        <div className="cabecera-acciones">
          <nav className="nav-tabs">
            <button
              className={`tab-boton ${vista === "gastos" ? "activo" : ""}`}
              onClick={() => setVista("gastos")}
            >
              Gastos
            </button>
            <button
              className={`tab-boton ${vista === "estadisticas" ? "activo" : ""}`}
              onClick={() => setVista("estadisticas")}
            >
              Estadísticas
            </button>
          </nav>
          <span className="usuario-info">{usuario?.nombre}</span>
          <button
            type="button"
            className="boton boton-secundario"
            onClick={onCerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {errorCarga && <p className="mensaje-error">{errorCarga}</p>}

      {vista === "gastos" ? (
        <div className="layout">
          <div className="columna-principal">
            <GastoForm
              gastoEditando={gastoEditando}
              onGuardar={handleGuardar}
              onCancelar={() => setGastoEditando(null)}
            />

            <div className="filtros">
              <label htmlFor="filtro-categoria">Categoría:</label>
              <select
                id="filtro-categoria"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option value="">Todas</option>
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="buscador"
                placeholder="Buscar por descripción..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />

              <a
                className="boton boton-secundario boton-exportar"
                href={urlExportarCSV()}
                target="_blank"
                rel="noreferrer"
              >
                Exportar CSV
              </a>
            </div>

            {cargando ? (
              <p className="texto-vacio">Cargando gastos...</p>
            ) : (
              <GastoList
                gastos={gastos}
                onEditar={setGastoEditando}
                onEliminar={handleEliminar}
              />
            )}
          </div>

          <div className="columna-lateral">
            <GastosRecurrentes
              recurrentes={recurrentes}
              onRegistrar={handleRegistrarRecurrente}
            />
            <ResumenCategorias resumen={resumen} />
          </div>
        </div>
      ) : (
        <div className="vista-estadisticas">
          <GraficaMensual gastos={todosGastos} />
          <div className="columna-lateral">
            <ResumenCategorias resumen={resumen} />
            <Presupuestos
              presupuestos={presupuestos}
              porCategoria={resumen ? resumen.porCategoria : {}}
              onGuardar={handleGuardarPresupuesto}
              onEliminar={handleEliminarPresupuesto}
            />
          </div>
        </div>
      )}
    </div>
  );
}
