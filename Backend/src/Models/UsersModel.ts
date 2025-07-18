import mongoose, { Document, Model, Schema } from "mongoose";

// 1. Define the interface for the User document
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  avatar?: string;
  isHost: boolean;
  bio?: string;
  location?: string;
  verification: {
    emailVerified: boolean;
    phoneVerified: boolean;
    idVerified: boolean;
  };
  savedListings: mongoose.Types.ObjectId[];
  hostedListings: mongoose.Types.ObjectId[];
  bookings: mongoose.Types.ObjectId[];
  createdAt?: Date;
}

// 2. Define the schema with the interface
const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phoneNumber: { type: String, trim: true },
    avatar: { type: String },
    isHost: { type: Boolean, default: false },
    bio: { type: String, trim: true },
    location: { type: String, trim: true },
    verification: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false },
      idVerified: { type: Boolean, default: false },
    },
    savedListings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
    hostedListings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);


const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default UserModel;
