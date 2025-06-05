// src/models/User.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IUser } from '@/types';

// Mongoose Document with _id and required password
export interface UserDocument extends Omit<IUser, '_id' | 'password'>, Document {
  _id: Types.ObjectId;
  password: string;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, select: false },
  name: { type: String, trim: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User: Model<UserDocument> = mongoose.models.User as Model<UserDocument> || mongoose.model<UserDocument>('User', userSchema);

export default User;
