import express from "express";
import Flight from "../models/Flight.js";
import {
  createFlightSchema,
  passengerSchema,
} from "../models/validationSchema.js";

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const flights = await Flight.find();
    res.json({
      success: true,
      data: flights,
      count: flights.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener los vuelos",
      message: error.message,
    });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    if (typeof code !== "string") {
      return res.status(400).json({
        success: false,
        error: "ID de vuelo inválido",
      });
    }
    const flight = await Flight.findOne({ flightCode: code });
    if (!flight) {
      return res.status(404).json({
        success: false,
        error: "Vuelo no encontrado",
      });
    }
    res.json({
      success: true,
      data: flight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener el vuelo",
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  const { flightCode, passengers } = req.body;
  const existingFlight = await Flight.findOne({ flightCode });
  if (existingFlight) {
    return res.status(400).json({
      success: false,
      error: "Ya existe un vuelo con este código",
    });
  }
  const result = createFlightSchema.parse({ flightCode, passengers });
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.message,
    });
  }
  try {
    const flight = new Flight({
      flightCode,
      passengers,
    });
    const savedFlight = await flight.save();
    res.status(201).json({
      success: true,
      data: savedFlight,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error al crear el vuelo",
      message: error.message,
    });
  }
});

router.put("/:code", async (req, res) => {
  const { code } = req.params;
  if (typeof code !== "string") {
    return res.status(400).json({
      success: false,
      error: "Código de vuelo inválido",
    });
  }
  try {
    const flight = await Flight.findOneAndUpdate(
      { flightCode: code },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!flight) {
      return res.status(404).json({
        success: false,
        error: "Vuelo no encontrado",
      });
    }
    res.json({
      success: true,
      data: flight,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error al actualizar el vuelo",
      message: error.message,
    });
  }
});

router.delete("/:code", async (req, res) => {
  const { code } = req.params;
  if (typeof code !== "string") {
    return res.status(400).json({
      success: false,
      error: "ID de vuelo inválido",
    });
  }
  try {
    const flight = await Flight.findOneAndDelete({ flightCode: code });
    if (!flight) {
      return res.status(404).json({
        success: false,
        error: "Vuelo no encontrado",
      });
    }
    res.json({
      success: true,
      message: "Vuelo eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al eliminar el vuelo",
      message: error.message,
    });
  }
});

router.post("/:code/passengers", async (req, res) => {
  const { code } = req.params;
  if (typeof code !== "string") {
    return res.status(400).json({
      success: false,
      error: "Código de vuelo inválido",
    });
  }
  try {
    const body = req.body;
    const result = passengerSchema.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: JSON.parse(result.error.message),
      });
    }

    const flight = await Flight.findOne({ flightCode: code });
    if (!flight) {
      return res.status(404).json({
        success: false,
        error: "Vuelo no encontrado",
      });
    }
    const existingPassenger = flight.passengers.find(
      (passenger) => passenger.id === req.body.id
    );
    if (existingPassenger) {
      return res.status(400).json({
        success: false,
        error: "Ya existe un pasajero con este ID en este vuelo",
      });
    }

    flight.passengers.push(body);
    const updatedFlight = await flight.save();
    res.status(201).json({
      success: true,
      data: updatedFlight,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error al agregar pasajero",
      message: error.message,
    });
  }
});

router.delete("/:flightCode/passengers/:passengerId", async (req, res) => {
  const { flightCode, passengerId } = req.params;
  if (typeof flightCode !== "string" || typeof passengerId !== "string") {
    return res.status(400).json({
      success: false,
      error: "ID de vuelo o pasajero inválido",
    });
  }
  try {
    const flight = await Flight.findOne({ flightCode });

    if (!flight) {
      return res.status(404).json({
        success: false,
        error: "Vuelo no encontrado",
      });
    }

    flight.passengers = flight.passengers.filter(
      (passenger) => passenger.id.toString() !== passengerId
    );

    const updatedFlight = await flight.save();

    res.json({
      success: true,
      data: updatedFlight,
      message: "Pasajero eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al eliminar pasajero",
      message: error.message,
    });
  }
});

export default router;
