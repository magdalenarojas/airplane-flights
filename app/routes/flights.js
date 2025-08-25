import express from "express";
import Flight from "../models/Flight.js";
import {
  createFlightSchema,
  passengerSchema,
} from "../models/validationSchema.js";
import { ZodError } from "zod";

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
  try {
    const { flightCode, capacity, passengers: initialPassengers } = req.body;
    const existingFlight = await Flight.findOne({ flightCode });
    if (existingFlight) {
      return res.status(409).json({
        success: false,
        error: "Ya existe un vuelo con este código",
      });
    }
    if (initialPassengers.length > capacity) {
      const boardedPassengers = getBoardedPassengers(
        initialPassengers,
        capacity
      );
    }

    const result = createFlightSchema.parse({
      flightCode,
      capacity,
      passengers,
    });
    const flight = new Flight(result);
    const savedFlight = await flight.save();

    const flightObject = savedFlight.toObject();
    const passengersWhoBoarded = flightObject.passengers.filter(
      (p) => p.boarded
    );
    const passengersOnWaitingList = flightObject.passengers.filter(
      (p) => !p.boarded
    );

    delete flightObject.passengers;

    res.status(201).json({
      success: true,
      data: {
        ...flightObject,
        passengersWhoBoarded,
        passengersOnWaitingList,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: error.flatten().fieldErrors,
      });
    }
    res.status(500).json({
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
    const result = passengerSchema.parse(body);

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

    flight.passengers.push(result);
    const updatedFlight = await flight.save();
    res.status(201).json({
      success: true,
      data: updatedFlight,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: error.flatten().fieldErrors,
      });
    }
    res.status(500).json({
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
