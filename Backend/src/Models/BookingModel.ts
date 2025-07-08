import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBooking extends Document {
  listing: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: "booked" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: Date;
}


const bookingSchema = new Schema<IBooking>(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 }, { unique: true });


export const BookingModel: Model<IBooking> = mongoose.model<IBooking>("Booking", bookingSchema);
