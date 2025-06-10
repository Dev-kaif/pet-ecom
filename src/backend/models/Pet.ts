import { IPet } from "@/types";
import mongoose, { Schema, Model, Document, Types } from "mongoose";

interface PetDocument extends Omit<IPet, "_id">, Document {
  _id: Types.ObjectId;
}

const petSchema = new Schema<PetDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    type: { type: String, required: true, trim: true }, // This often serves as 'breed' for filtering
    age: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "N/A"],
      required: true,
    },
    size: {
      type: String,
      enum: ["Tiny", "Small", "Medium", "Large"],
      required: true,
    },
    weight: { type: Number, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    images: [{ type: String }], // Array of strings for image URLs
    description: { type: String, trim: true, required: false }, // Made optional as per IPet

    isNewlyAdded: { type: Boolean, default: false }, // Optional, can be used for "new arrivals"
    availableDate: { type: String, required: false }, // Example: "09, Sep 2023"
    breed: { type: String, trim: true, required: false }, // Explicit breed field
    dateOfBirth: { type: String, required: false }, // Example: "09, Jul 2023"
    additionalInfo: [{ type: String }], // Array of strings for additional bullet points
    mapLocation: {
      address: { type: String, required: false },
      coords: {
        lat: { type: Number, required: false },
        lng: { type: Number, required: false },
      },
      link: { type: String, required: false }, // Embed link for map
    },
  },
  { timestamps: true }
);

// Add a text index for name, category, type, description, and breed for search capabilities
petSchema.index({
  name: "text",
  category: "text",
  type: "text", // Your 'type' field is often used like 'breed' in the UI
  description: "text",
  breed: "text", // Index the new 'breed' field too
});

const Pet: Model<PetDocument> =
  (mongoose.models.Pet as Model<PetDocument>) ||
  mongoose.model<PetDocument>("Pet", petSchema);

export default Pet;