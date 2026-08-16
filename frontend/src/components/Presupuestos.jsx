import { useState } from "react";

const formatoMonto = (monto) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    monto
  );

export default function Presupuestos({
  presupuestos,
  porCategoria,
  onGuardar,
  onEliminar
}) {
  const [categoria, setCategoria] = useState("");
  const [limite, setLimite] = useState("");
  const [error, setError] = useState("");

  const categorias = Array.from(
    new Set([...Object.keys(presupuestos), ...Object.keys(porCategoria)])
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const valor = parseFloat(limite);
    if (!categoria.trim() || isNaN(valor) || valor < 0) {
      setError("Indica una categoría y un límite válido.");
      return;
    }

    try {
      await onGuardar(categoria.trim(), valor);
      setCategoria("");
      setLimite("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tarjeta">
      <h2>Presupuestos por categoría</h2>

      {error && <p className="mensaje-error">{error}</p>}

      <form className="fila fila-presupuesto" onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="presupuesto-categoria">Categoría</label>
          <input
            id="presupuesto-categoria"
            type="text"
            placeholder="Ej. Comida"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="presupuesto-limite">Límite mensual (€)</label>
          <input
            id="presupuesto-limite"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={limite}
            onChange={(e) => setLimite(e.target.value)}
          />
        </div>
        <button type="submit" className="boton boton-primario boton-ajustado">
          Guardar
        </button>
      </form>

      {categorias.length === 0 ? (
        <p className="texto-vacio">
          Todavía no has definido ningún presupuesto.
        </p>
      ) : (
        <div className="lista-presupuestos">
          {categorias.map((cat) => {
            const gastado = porCategoria[cat] || 0;
            const limiteCategoria = presupuestos[cat];
            const tienePresupuesto = limiteCategoria !== undefined;
            const porcentaje = tienePresupuesto
              ? Math.min((gastado / limiteCategoria) * 100, 100)
              : 0;
            const excedido = tienePresupuesto && gastado > limiteCategoria;
            const cercaDelLimite =
              tienePresupuesto && !excedido && porcentaje >= 80;

            return (
              <div className="barra-categoria" key={cat}>
                <div className="barra-categoria-encabezado">
                  <span>{cat}</span>
                  <span>
                    {formatoMonto(gastado)}
                    {tienePresupuesto && ` / ${formatoMonto(limiteCategoria)}`}
                  </span>
                </div>
                {tienePresupuesto && (
                  <>
                    <div className="barra-fondo">
                      <div
                        className={`barra-relleno ${
                          excedido
                            ? "barra-excedida"
                            : cercaDelLimite
                            ? "barra-cerca-limite"
                            : ""
                        }`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    {excedido && (
                      <p className="aviso-presupuesto aviso-excedido">
                        Has superado el presupuesto de esta categoría.
                      </p>
                    )}
                    {cercaDelLimite && (
                      <p className="aviso-presupuesto aviso-cerca">
                        Te estás acercando al límite mensual.
                      </p>
                    )}
                    <button
                      type="button"
                      className="boton boton-icono quitar-presupuesto"
                      onClick={() => onEliminar(cat)}
                      title="Quitar presupuesto"
                    >
                      ✕ quitar límite
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
