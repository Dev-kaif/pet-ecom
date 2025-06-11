// src/models/User.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IAddress, IUser } from '@/types'; // Ensure correct path to your types

// Address Subdocument Schema
interface AddressDocument extends Omit<IAddress, '_id'>, Document {}

const addressSchema = new Schema<AddressDocument>({
    street: { type: String, required: [true, 'Street is required.'] },
    city: { type: String, required: [true, 'City is required.'] },
    state: { type: String, required: [true, 'State is required.'] },
    zipCode: { type: String, required: [true, 'Zip code is required.'] },
    country: { type: String, required: [true, 'Country is required.'] },
    label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    isDefault: { type: Boolean, default: false }, // Flag for default address
  }, { _id: true }); // Ensure subdocuments get their own _id


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
