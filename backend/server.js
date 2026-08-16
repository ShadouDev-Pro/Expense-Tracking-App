require("dotenv").config();

const express = require("express");
const cors = require("cors");
const gastosRoutes = require("./routes/gastos.routes");
const presupuestosRoutes = require("./routes/presupuestos.routes");
const authRoutes = require("./routes/auth.routes");
const verificarToken = require("./middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas públicas: registro e inicio de sesión
app.use("/api/auth", authRoutes);

// Rutas protegidas: requieren un token válido
app.use("/api/gastos", verificarToken, gastosRoutes);
app.use("/api/presupuestos", verificarToken, presupuestosRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API de control de gastos funcionando correctamente" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
