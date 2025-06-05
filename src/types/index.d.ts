// src/types/index.d.ts (excerpt)
import { Types } from "mongoose";

export interface IProduct {
//   _id?: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  category: string;
  imageUrl?: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
  reviewsCount?: number;
}

export interface IReview {
//   _id?: Types.ObjectId;
  productId: Types.ObjectId; 
  userId: Types.ObjectId; 
  userName: string; 
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password?: string;
  name?: string;
  role: "user" | "admin"; 
  createdAt?: Date;
  updatedAt?: Date;
}

// For the user object retrieved after authentication
export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
}
