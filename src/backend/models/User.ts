// src/models/User.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IAddress, IUser } from '@/types'; // Ensure correct path to your types

// Address Subdocument Schema
interface AddressDocument extends Omit<IAddress, '_id'>, Document {}

const addressSchema = new Schema<AddressDocument>({
  street: { type: String, required: [true, 'Street address is required.'], trim: true },
  apartment: { type: String, trim: true }, // Added for apt/suite/unit (often optional)
  city: { type: String, required: [true, 'City is required.'], trim: true },
  state: { type: String, required: [true, 'State/Province is required.'], trim: true }, // Clarified as State/Province
  zipCode: { type: String, required: [true, 'Zip/Postal code is required.'], trim: true }, // Clarified as Zip/Postal Code
  country: { type: String, required: [true, 'Country is required.'], trim: true },
  
  // Optional: Add a 'name' field for the address, e.g., "John Doe's Home"
  // fullName: { type: String, trim: true, required: false },

  label: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home',
    trim: true,
    required: false // It can default, so not strictly required on creation
  },
  isDefault: { type: Boolean, default: false }, // Flag for default address
}, {
  _id: true, // Ensure subdocuments get their own _id
  timestamps: false // Subdocuments usually don't need their own timestamps, the parent User document has them
});

export interface UserDocument extends Omit<IUser, '_id' | 'password'>, Document {
  _id: Types.ObjectId; 
  password: string;
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address.'], // Basic email regex validation
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.'],
    select: false, // Prevents password from being returned by default in queries
  },
  firstName: { type: String, trim: true }, // Added firstName
  lastName: { type: String, trim: true },  // Added lastName
  name: { // This can be a virtual if you combine firstName and lastName, or a separate field
    type: String,
    trim: true,
    required: false, // Name can be optional if firstName/lastName are used
  },
  phone: {
    type: String,
    trim: true,
    required: false, // Optional phone number
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number.'] // E.164 format regex (basic)
  },
  profilePicture: {
    type: String,
    trim: true,
    required: false, // Optional profile picture URL
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/, 'Please provide a valid image URL.'], // Basic URL validation
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Expanded roles
    default: 'user',
    required: [true, 'User role is required.']
  },
  addresses: {
    type: [addressSchema], // Array of address subdocuments
    default: [],
  },
  passwordResetToken: {
    type: String,
    select: false, // Don't return this by default
  },
  passwordResetExpires: {
    type: Date,
    select: false, // Don't return this by default
  },
}, {
  timestamps: true, 
  toJSON: { virtuals: true, getters: true }, // Include virtuals and getters when converting to JSON
  toObject: { virtuals: true, getters: true }, // Include virtuals and getters when converting to object
});


userSchema.index({ email: 1 });
userSchema.index({ role: 1 });  
userSchema.index({ 'addresses.isDefault': 1 });


const User: Model<UserDocument> = mongoose.models.User as Model<UserDocument> || mongoose.model<UserDocument>('User', userSchema);

export default User;
