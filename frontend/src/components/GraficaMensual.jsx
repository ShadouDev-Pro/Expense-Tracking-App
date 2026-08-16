import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const formatoMonto = (monto) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    monto
  );

// Agrupa los gastos por mes (a partir de su fecha) y devuelve
// los totales ordenados cronológicamente, listos para el gráfico.
function agruparPorMes(gastos) {
  const mapa = {};

  gastos.forEach((g) => {
    const fecha = new Date(g.fecha);
    const clave = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}`;
    mapa[clave] = (mapa[clave] || 0) + g.monto;
  });

  return Object.entries(mapa)
    .sort(([claveA], [claveB]) => (claveA > claveB ? 1 : -1))
    .map(([clave, total]) => {
      const [anio, mes] = clave.split("-");
      const fechaEtiqueta = new Date(Number(anio), Number(mes) - 1, 1);
      const etiqueta = fechaEtiqueta.toLocaleDateString("es-ES", {
        month: "short",
        year: "2-digit"
      });
      return { mes: etiqueta, total: Math.round(total * 100) / 100 };
    });
}

export default function GraficaMensual({ gastos }) {
  const datos = agruparPorMes(gastos);

  return (
    <div className="tarjeta">
      <h2>Gasto mes a mes</h2>

      {datos.length === 0 ? (
        <p className="texto-vacio">
          Aún no hay datos suficientes para dibujar la gráfica.
        </p>
      ) : (
        <div className="contenedor-grafica">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={datos}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barraNeon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff2ec4" />
                  <stop offset="100%" stopColor="#00e7ff" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(0, 231, 255, 0.12)"
              />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 12, fill: "#7c8bb3" }}
                axisLine={{ stroke: "rgba(0, 231, 255, 0.25)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#7c8bb3" }}
                width={55}
                axisLine={{ stroke: "rgba(0, 231, 255, 0.25)" }}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => formatoMonto(value)}
                contentStyle={{
                  background: "#0d1024",
                  border: "1px solid rgba(0, 231, 255, 0.4)",
                  borderRadius: 6,
                  color: "#e7f3ff"
                }}
                labelStyle={{ color: "#00e7ff" }}
                cursor={{ fill: "rgba(0, 231, 255, 0.06)" }}
              />
              <Bar dataKey="total" fill="url(#barraNeon)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
