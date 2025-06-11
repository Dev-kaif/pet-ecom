import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { ITeamMember } from "@/types"; 

// 1. Define the Mongoose Document interface
interface TeamMemberDocument extends Omit<ITeamMember, "_id">, Document {
  _id: Types.ObjectId;
}

const SocialSchema = new Schema(
  {
    facebook: { type: String, trim: true, default: "#" },
    twitter: { type: String, trim: true, default: "#" },
    instagram: { type: String, trim: true, default: "#" },
    youtube: { type: String, trim: true, default: "#" },
  },
  // Prevents Mongoose from adding an _id to this subdocument
  { _id: false }
);

const ContactSchema = new Schema(
  {
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    social: { type: SocialSchema, required: true }, // The social object itself is required
  },
  { _id: false }
);

// Define the main TeamMember Schema
const teamMemberSchema = new Schema<TeamMemberDocument>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    contact: { type: ContactSchema, required: true },
    imageUrl: { type: String, required: true, trim: true },
    showOnHome: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

const TeamMember: Model<TeamMemberDocument> =
  (mongoose.models.TeamMember as Model<TeamMemberDocument>) ||
  mongoose.model<TeamMemberDocument>("TeamMember", teamMemberSchema);

export default TeamMember;