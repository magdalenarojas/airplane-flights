import connectDB from "./config/database.js";
import { passengersData } from "./data/passengers.js";
import Flight from "./models/Flight.js";

connectDB();

const distributePassengersIntoFlights = (passengers, numFlights = 5) => {
  const flights = [];
  const passengersPerFlight = Math.ceil(passengers.length / numFlights);

  for (let i = 0; i < numFlights; i++) {
    const startIndex = i * passengersPerFlight;
    const endIndex = Math.min(
      startIndex + passengersPerFlight,
      passengers.length
    );
    const flightPassengers = passengers.slice(startIndex, endIndex);

    if (flightPassengers.length > 0) {
      flights.push({
        flightCode: generateFlightCode(),
        passengers: flightPassengers,
      });
    }
  }

  return flights;
};

const generateFlightCode = () => {
  const airlines = ["IB", "VY", "FR", "UX", "LA", "AV", "AM"];
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const number = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `${airline}${number}`;
};

const seedDatabase = async () => {
  try {
    await Flight.deleteMany({});

    const sampleFlights = distributePassengersIntoFlights(passengersData);
    const flights = await Flight.insertMany(sampleFlights);
    console.log(`✅ ${flights.length} vuelos creados con pasajeros`);

    process.exit(0);
  } catch (error) {
    console.error("Error poblando la base de datos:", error);
    process.exit(1);
  }
};

seedDatabase();
