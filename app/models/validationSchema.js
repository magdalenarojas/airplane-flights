import { z } from "zod";

export const flightCategorySchema = z.enum([
  "Black",
  "Platinum",
  "Gold",
  "Normal",
]);

export const passengerSchema = z.object({
  id: z.number(),
  name: z.string(),
  hasConnections: z.boolean().default(false),
  age: z.number(),
  flightCategory: flightCategorySchema,
  hasCheckedBaggage: z.boolean().default(false),
  reservationId: z.string(),
  boarded: z.boolean().optional(),
});

export const createFlightSchema = z.object({
  flightCode: z.string(),
  capacity: z.number(),
  passengers: z.array(passengerSchema).default([]),
});
