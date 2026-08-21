# App de Gestión de Gastos

<div align="center">

![Status](https://img.shields.io/badge/status-In%20Development-yellow)
![Project Status](https://img.shields.io/badge/Project-Active%20Development-orange)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-Secure-8A2BE2)
![npm](https://img.shields.io/badge/npm-Workspaces-CB3837?logo=npm&logoColor=white)

</div>

Aplicación full-stack para gestionar gastos personales de forma simple, visual y eficiente. Permite registrar ingresos y egresos, controlar presupuestos por categoría, revisar tendencias y mantener un seguimiento claro del estado financiero personal.

## ✨ Descripción general

Este proyecto combina un backend en Node.js y Express con un frontend en React para ofrecer una solución completa para el control de gastos diarios. Está pensado para ser fácil de usar, rápido de configurar y útil tanto para seguimiento personal como para pruebas de concepto de aplicaciones financieras.

## 🚀 Características principales

- Gestión completa de gastos con operaciones CRUD.
- Registro y actualización de presupuestos por categoría.
- Visualización de gastos recurrentes para seguimiento de pagos periódicos.
- Resúmenes y estadísticas globales por categoría.
- Exportación de datos en formato CSV.
- Autenticación segura con JWT y bcrypt.
- Estructura modular y compatible con npm workspaces.
- Frontend responsive para uso en distintos dispositivos.

## 🛠️ Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Backend | Node.js + Express |
| Frontend | React + Vite |
| Autenticación | JWT + bcryptjs |
| Persistencia | Archivos JSON locales |
| Gestión de dependencias | npm workspaces |
| Estilos | CSS personalizado |

## 📦 Requisitos

- Node.js 18 o superior
- npm 9 o superior

## ▶️ Inicio rápido

El proyecto usa npm workspaces, por lo que con una sola instalación se preparan tanto el backend como el frontend.

```bash
npm install
```

### Ejecutar la aplicación completa

```bash
npm run dev
```

Esto levantará:

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

### Ejecutar por separado

```bash
npm run start:backend
npm run start:frontend
```

> Los datos se guardan en archivos JSON dentro del backend, por lo que no es necesario configurar una base de datos externa para iniciar el proyecto.

## 🔐 Configuración de autenticación

La aplicación incluye registro e inicio de sesión con usuario y contraseña. Para configurar correctamente la firma de los tokens JWT, puedes crear un archivo `.env` dentro de la carpeta `backend` con una variable segura.

```bash
cd backend
cp .env.example .env
```

Luego edita el archivo generado y define un valor seguro para `JWT_SECRET`.

Ejemplo:

```env
JWT_SECRET=tu_clave_super_segura
PORT=3000
```

La primera vez, será necesario crear una cuenta desde la pantalla de login.

## 📁 Estructura del proyecto

```text
api-gastos/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── gastos.controller.js
│   │   └── presupuestos.controller.js
│   ├── data/
│   │   ├── db.js
│   │   ├── gastos.json
│   │   ├── presupuestos.json
│   │   ├── presupuestosDb.js
│   │   ├── usuarios.json
│   │   └── usuariosDb.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── gastos.routes.js
│   │   └── presupuestos.routes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   └── gastos.js
│   │   ├── components/
│   │   │   ├── GastoForm.jsx
│   │   │   ├── GastoList.jsx
│   │   │   ├── GastosRecurrentes.jsx
│   │   │   ├── GraficaMensual.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Presupuestos.jsx
│   │   │   └── ResumenCategorias.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── GastosApp.jsx
│   │   ├── main.jsx
│   │   └── useAuth.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## 🌐 Endpoints de la API

La API está separada en rutas públicas y protegidas. Todas las rutas de gastos y presupuestos requieren un token JWT válido en el header `Authorization`.

### Autenticación

| Método | Endpoint | Descripción |
| --- | --- | --- |
| POST | `/api/auth/registrar` | Registra un nuevo usuario y devuelve un token JWT |
| POST | `/api/auth/login` | Inicia sesión y devuelve un token JWT |

### Gastos

| Método | Endpoint | Descripción |
| --- | --- | --- |
| POST | `/api/gastos` | Crea un nuevo gasto |
| GET | `/api/gastos` | Obtiene todos los gastos con filtros opcionales (`categoria`, `desde`, `hasta`, `buscar`) |
| GET | `/api/gastos/resumen` | Devuelve el total general y el resumen por categoría |
| GET | `/api/gastos/recurrentes` | Obtiene los gastos marcados como recurrentes |
| GET | `/api/gastos/exportar-csv` | Exporta todos los gastos en formato CSV |
| GET | `/api/gastos/:id` | Obtiene un gasto concreto por ID |
| PUT | `/api/gastos/:id` | Actualiza un gasto por ID |
| DELETE | `/api/gastos/:id` | Elimina un gasto por ID |

### Presupuestos

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/presupuestos` | Obtiene todos los presupuestos |
| PUT | `/api/presupuestos` | Crea o actualiza el presupuesto de una categoría |
| DELETE | `/api/presupuestos/:categoria` | Elimina el presupuesto de una categoría |

### Ejemplo de uso autenticado

```http
Authorization: Bearer <token_jwt>
```

## � Licencia

Este proyecto está licenciado bajo la GNU General Public License v3.0 (GPL-3.0). Puedes consultar el texto completo en [LICENSE](LICENSE).

## �🚧 Estado del proyecto

Este proyecto se encuentra actualmente en desarrollo activo. Se están añadiendo mejoras continuas, correcciones de experiencia de usuario y nuevas funcionalidades para convertirlo en una herramienta más completa y robusta.

## 🧭 Futuras implementaciones

La hoja de ruta del proyecto incluye las siguientes mejoras:

- Integración con una base de datos persistente (MongoDB, PostgreSQL o MySQL).
- Mejoras en la gestión de gastos recurrentes con automatización y edición avanzada.
- Añadir métricas más detalladas, gráficas comparativas y análisis mensual.
- Sistema de notificaciones para presupuestos excedidos o gastos inusuales.
- Exportación adicional a PDF y Excel.
- Mejoras de UX/UI para una experiencia más moderna y accesible.
- Implementación de despliegue profesional en producción.
- Dashboard con indicadores clave de salud financiera personal.

> ⚠️ **Demo educativa**
>
> Esta aplicación ha sido desarrollada exclusivamente como proyecto
> educativo y de portfolio. No está destinada a gestionar información
> financiera real.
>
> No introduzcas datos personales, financieros o sensibles reales.
> Utiliza únicamente datos ficticios para las pruebas.
