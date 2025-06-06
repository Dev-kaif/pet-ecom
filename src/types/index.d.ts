import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  category: string;
  images?: string[];
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
  reviewsCount?: number;
  isNewlyReleased?: boolean;
  isOnSale?: boolean;
}

export interface IReview {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  email: string;
  password?: string;
  name?: string;
  role: "user" | "admin";
  addresses?: IAddress[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ICartItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface ICart {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartItemFrontend {
  _id: string;
  productId: string; 
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "card" | "cash_on_delivery" | "paypal";

export interface IOrder {
  _id:Types.ObjectId;
  userId: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  totalPrice: number;
  shippingPrice: number;
  taxPrice: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentResult?: {
    id: string;
    status: string;
    update_time?: string;
    email_address?: string;
  };
  isPaid: boolean;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWishlistItem {
  _id?: Types.ObjectId | string; 
  productId: Types.ObjectId | string; 
  addedAt: Date; 
}

export interface IWishlist {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string; 
  items: IWishlistItem[]; 
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IWishlistItemFrontend {
  _id: string; 
  productId: string; 
  name: string;
  imageUrl: string;
  price: number;
  oldPrice?: number; 
  isNewlyReleased?: boolean; 
  isOnSale?: boolean; 
  addedAt: string; 
  stock?: number; 
}
