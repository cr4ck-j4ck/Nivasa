import mongoose, { Document, Model, Schema } from "mongoose";

// 1. Define the interface for the User document
export interface IUser extends Document {
  googleId: string;
  provider: string;
  firstName: string;
  lastName: string;
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
  savedListings: mongoose.Types.ObjectId[] | null;
  hostedListings: mongoose.Types.ObjectId[] | null;
  bookings: mongoose.Types.ObjectId[] | null;
  wishlist: mongoose.Types.ObjectId[] | null;
  createdAt?: Date;
}

// 2. Define the schema with the interface
const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, sparse: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    provider: {
      type: String,
      enum: ["google", "email"],
      default: "email",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "email";
      },
      minlength: 6,
    },
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
    savedListings: [{ type: Schema.Types.ObjectId, ref: "Listing", default:[] }],
    hostedListings: [{ type: Schema.Types.ObjectId, ref: "Listing", default:[] }],
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking", default:[]}],
    createdAt: { type: Date, default: Date.now },
    wishlist: [ {type: Schema.Types.ObjectId, ref:"Listing" } ]
  },
  { timestamps: true, versionKey: false }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default UserModel;
