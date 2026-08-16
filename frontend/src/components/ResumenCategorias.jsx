const formatoMonto = (monto) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    monto
  );

export default function ResumenCategorias({ resumen }) {
  if (!resumen) return null;

  const { total, cantidadGastos, porCategoria } = resumen;
  const categorias = Object.entries(porCategoria).sort((a, b) => b[1] - a[1]);
  const maximo = categorias.length > 0 ? categorias[0][1] : 0;

  return (
    <div className="tarjeta resumen">
      <div className="resumen-total">
        <span className="resumen-total-label">Total gastado</span>
        <span className="resumen-total-valor">{formatoMonto(total)}</span>
        <span className="resumen-total-cantidad">
          {cantidadGastos} {cantidadGastos === 1 ? "gasto" : "gastos"}
        </span>
      </div>

      {categorias.length > 0 && (
        <div className="resumen-categorias">
          {categorias.map(([categoria, monto]) => (
            <div className="barra-categoria" key={categoria}>
              <div className="barra-categoria-encabezado">
                <span>{categoria}</span>
                <span>{formatoMonto(monto)}</span>
              </div>
              <div className="barra-fondo">
                <div
                  className="barra-relleno"
                  style={{ width: `${(monto / maximo) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
