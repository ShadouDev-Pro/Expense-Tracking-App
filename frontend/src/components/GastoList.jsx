const formatoFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

const formatoMonto = (monto) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    monto
  );

export default function GastoList({ gastos, onEditar, onEliminar }) {
  if (gastos.length === 0) {
    return (
      <div className="tarjeta">
        <p className="texto-vacio">Todavía no hay gastos registrados.</p>
      </div>
    );
  }

  return (
    <div className="tarjeta">
      <div className="tabla-scroll">
        <table className="tabla-gastos">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => (
            <tr key={gasto.id}>
              <td>
                {gasto.descripcion}
                {gasto.recurrente && (
                  <span className="marca-recurrente" title="Gasto recurrente">
                    {" "}
                    🔁
                  </span>
                )}
              </td>
              <td>
                <span className="etiqueta-categoria">{gasto.categoria}</span>
              </td>
              <td>{formatoFecha(gasto.fecha)}</td>
              <td className="monto">{formatoMonto(gasto.monto)}</td>
              <td className="acciones-fila">
                <button
                  className="boton boton-icono"
                  onClick={() => onEditar(gasto)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="boton boton-icono"
                  onClick={() => onEliminar(gasto.id)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
