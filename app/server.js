import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Importar configuración y rutas
import connectDB from "./config/database.js";
import flightRoutes from "./routes/flights.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/flights", flightRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bienvenido a la API de vuelos",
    version: "1.0.0",
    endpoints: {
      flights: "/api/flights",
    },
  });
});

// Middleware para manejar rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
  });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    message: error.message,
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`API de vuelos: http://localhost:${PORT}/api/flights`);
});
