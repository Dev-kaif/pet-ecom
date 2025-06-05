// src/models/Product.ts
import mongoose, { Schema, Model, Document } from 'mongoose';
import { IProduct } from '@/types';

// Define the Mongoose Document type for Product
interface ProductDocument extends IProduct, Document {}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true, lowercase: true }, // e.g., 'food', 'toys', 'accessories'
  imageUrl: { type: String, default: '/images/placeholder-product.jpg' },
  stock: { type: Number, default: 0, min: 0 },
}, { timestamps: true }); // Mongoose automatically adds createdAt and updatedAt

// Add a text index for name and description for search capabilities
productSchema.index({ name: 'text', description: 'text' });

const Product: Model<ProductDocument> = mongoose.models.Product as Model<ProductDocument> || mongoose.model<ProductDocument>('Product', productSchema);

export default Product;