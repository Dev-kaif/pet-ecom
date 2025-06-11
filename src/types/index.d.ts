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
  _id?: string | Types.ObjectId; 
  email: string;
  password?: string; 
  name?: string; 
  firstName?: string; 
  lastName?: string;  
  phone?: string; 
  profilePicture?: string; 
  role: 'user' | 'admin'; 
  addresses?: IAddress[]; 
  passwordResetToken?: string; 
  passwordResetExpires?: Date; 
  createdAt?: string; 
  updatedAt?: string; 
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
}

export interface IAddress {
  _id?: string | Types.ObjectId; 
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  label?: 'Home' | 'Work' | 'Other'; 
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



export interface IPet {
  _id: string; 
  name: string;
  category: string;
  type: string;
  age: string;
  color: string;
  gender: "Male" | "Female" | "N/A";
  size: "Tiny" | "Small" | "Medium" | "Large";
  weight: number;
  price: number; 
  location: string; 
  images: string[]; 
  description?: string;
  isNewlyAdded?: boolean;
  availableDate?: string; 
  breed?: string; 
  dateOfBirth?: string; 
  additionalInfo?: string[]; 
  mapLocation?: { 
    address: string;
    coords: { lat: number; lng: number };
    link: string; 
  };
  createdAt?: string;
  updatedAt?: string;
}


export interface ITeamMember {
  _id: string;
  name: string;
  title: string;
  description: string;
  experience: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    social: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
    };
  };
  imageUrl: string;
  showOnHome?: boolean;
  createdAt?: string; 
  updatedAt?: string;
}

export interface IGalleryImage {
  _id?: string | Types.ObjectId; 
  imageUrl: string; 
  createdAt?: string; 
  updatedAt?: string; 
}