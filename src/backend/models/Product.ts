// src/models/Product.ts
import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IProduct } from "@/types";

// Define the Mongoose Document type for Product
interface ProductDocument extends IProduct, Document {
  _id: Types.ObjectId;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0, required: false },
    category: { type: String, required: true, trim: true, lowercase: true }, // e.g., 'food', 'toys', 'accessories'
    images: [{ type: String }],
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
); // Mongoose automatically adds createdAt and updatedAt

// Add a text index for name and description for search capabilities
productSchema.index({ name: "text", description: "text" });

const Product: Model<ProductDocument> =
  (mongoose.models.Product as Model<ProductDocument>) ||
  mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
