// src/backend/models/Reservation.ts

import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IReservation } from "@/types"; // Import the interface from your types file

interface ReservationDocument extends Omit<IReservation, "_id">, Document {
  _id: Types.ObjectId;
}

// Define the Mongoose Schema
const ReservationSchema = new Schema<ReservationDocument>({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true }, 
  species: { type: String, required: true, trim: true },
  breed: { type: String, required: true, trim: true },
  reason: { type: String, required: true, trim: true },
  specialNote: { type: String, trim: true, required: false }, // Optional

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], // Allowed values
    default: 'pending',
    required: true,
  },
  adminNotes: { type: String, trim: true, required: false }, // Optional field for internal notes
}, {
  timestamps: true 
});

const Reservation: Model<ReservationDocument> =
  (mongoose.models.Reservation as Model<ReservationDocument>) ||
  mongoose.model<ReservationDocument>("Reservation", ReservationSchema);

export default Reservation;