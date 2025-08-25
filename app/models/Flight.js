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
  boarded: {
    type: Boolean,
    default: true,
  },
});

const flightSchema = new mongoose.Schema(
  {
    flightCode: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    passengers: {
      type: [passengerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
  { _id: false }
);

const hide = {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    if (Array.isArray(ret.passengers)) {
      ret.passengers = ret.passengers.map(({ _id, ...p }) => p);
    }
    return ret;
  },
};
flightSchema.set("toJSON", hide);
flightSchema.set("toObject", hide);

export default mongoose.model("Flight", flightSchema);
