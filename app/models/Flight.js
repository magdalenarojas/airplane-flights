import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  hasConnections: {
    type: Boolean,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  flightCategory: {
    type: String,
    enum: ["Black", "Platinum", "Gold", "Normal"],
    required: true,
  },
  reservationId: {
    type: String,
    required: true,
  },
  hasCheckedBaggage: {
    type: Boolean,
    required: true,
  },
});

const flightSchema = new mongoose.Schema(
  {
    flightCode: {
      type: String,
      required: true,
      unique: true,
    },
    passengers: {
      type: [passengerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Flight", flightSchema);
