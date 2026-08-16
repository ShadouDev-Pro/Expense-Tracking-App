import { useEffect, useState } from "react";

const CATEGORIAS_SUGERIDAS = [
  "Comida",
  "Transporte",
  "Ocio",
  "Salud",
  "Vivienda",
  "Educación",
  "Otros"
];

const ESTADO_INICIAL = {
  descripcion: "",
  monto: "",
  categoria: "",
  recurrente: false
};

export default function GastoForm({ gastoEditando, onGuardar, onCancelar }) {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [error, setError] = useState("");

  useEffect(() => {
    if (gastoEditando) {
      setForm({
        descripcion: gastoEditando.descripcion,
        monto: gastoEditando.monto,
        categoria: gastoEditando.categoria,
        recurrente: Boolean(gastoEditando.recurrente)
      });
    } else {
      setForm(ESTADO_INICIAL);
    }
  }, [gastoEditando]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const monto = parseFloat(form.monto);
    if (!form.descripcion.trim() || !form.categoria.trim() || isNaN(monto)) {
      setError("Completa descripción, monto y categoría correctamente.");
      return;
    }

    try {
      await onGuardar({
        descripcion: form.descripcion.trim(),
        monto,
        categoria: form.categoria.trim(),
        recurrente: form.recurrente
      });
      setForm(ESTADO_INICIAL);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="tarjeta formulario" onSubmit={handleSubmit}>
      <h2>{gastoEditando ? "Editar gasto" : "Nuevo gasto"}</h2>

      {error && <p className="mensaje-error">{error}</p>}

      <div className="campo">
        <label htmlFor="descripcion">Descripción</label>
        <input
          id="descripcion"
          name="descripcion"
          type="text"
          placeholder="Ej. Compra semanal"
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>

      <div className="fila">
        <div className="campo">
          <label htmlFor="monto">Monto (€)</label>
          <input
            id="monto"
            name="monto"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.monto}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="categoria">Categoría</label>
          <input
            id="categoria"
            name="categoria"
            list="categorias-sugeridas"
            placeholder="Ej. Comida"
            value={form.categoria}
            onChange={handleChange}
          />
          <datalist id="categorias-sugeridas">
            {CATEGORIAS_SUGERIDAS.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>
      </div>

      <label className="campo-checkbox">
        <input
          type="checkbox"
          name="recurrente"
          checked={form.recurrente}
          onChange={handleChange}
        />
        Es un gasto recurrente (suscripción, alquiler...)
      </label>

      <div className="acciones-formulario">
        <button type="submit" className="boton boton-primario">
          {gastoEditando ? "Guardar cambios" : "Añadir gasto"}
        </button>
        {gastoEditando && (
          <button
            type="button"
            className="boton boton-secundario"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
