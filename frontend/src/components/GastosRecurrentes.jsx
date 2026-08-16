const formatoMonto = (monto) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    monto
  );

export default function GastosRecurrentes({ recurrentes, onRegistrar }) {
  if (recurrentes.length === 0) return null;

  // Solo mostramos una plantilla por combinación descripción+categoría+monto,
  // para no repetir el mismo gasto recurrente varias veces en la lista.
  const plantillas = Object.values(
    recurrentes.reduce((acc, g) => {
      const clave = `${g.descripcion}__${g.categoria}__${g.monto}`;
      if (!acc[clave]) acc[clave] = g;
      return acc;
    }, {})
  );

  return (
    <div className="tarjeta">
      <h2>Gastos recurrentes</h2>
      <ul className="lista-recurrentes">
        {plantillas.map((g) => (
          <li key={`${g.descripcion}-${g.categoria}-${g.monto}`}>
            <div>
              <span className="recurrente-descripcion">{g.descripcion}</span>
              <span className="etiqueta-categoria">{g.categoria}</span>
            </div>
            <div className="recurrente-acciones">
              <span className="monto">{formatoMonto(g.monto)}</span>
              <button
                type="button"
                className="boton boton-secundario"
                onClick={() =>
                  onRegistrar({
                    descripcion: g.descripcion,
                    monto: g.monto,
                    categoria: g.categoria,
                    recurrente: true
                  })
                }
              >
                Registrar este mes
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
