import express from "express";
import Flight from "../models/Flight.js";

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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "ID de vuelo inválido",
      });
    }
    const flight = await Flight.findById(id);
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
  const result = createFlightSchema.safeParse({ flightCode, passengers });
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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      error: "ID de vuelo inválido",
    });
  }
  try {
    const flight = await Flight.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      error: "ID de vuelo inválido",
    });
  }
  try {
    const flight = await Flight.findByIdAndDelete(id);
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

router.get("/code/:flightCode", async (req, res) => {
  const { flightCode } = req.params;
  if (typeof flightCode !== "string") {
    return res.status(400).json({
      success: false,
      error: "Código de vuelo inválido",
    });
  }
  try {
    const flights = await Flight.find({
      flightCode,
    });
    res.json({
      success: true,
      data: flights,
      count: flights.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al buscar vuelos",
      message: error.message,
    });
  }
});

router.post("/:id/passengers", async (req, res) => {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      error: "ID de vuelo inválido",
    });
  }
  try {
    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({
        success: false,
        error: "Vuelo no encontrado",
      });
    }

    flight.passengers.push(req.body);
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

router.delete("/:flightId/passengers/:passengerId", async (req, res) => {
  const { flightId, passengerId } = req.params;
  if (typeof flightId !== "string" || typeof passengerId !== "string") {
    return res.status(400).json({
      success: false,
      error: "ID de vuelo o pasajero inválido",
    });
  }
  try {
    const flight = await Flight.findById(flightId);

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
