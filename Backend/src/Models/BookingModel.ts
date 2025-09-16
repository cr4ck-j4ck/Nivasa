import mongoose, { Document, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IBooking extends Document {
  bookingId: string;
  listing: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  host: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  totalPrice: number;
  priceBreakdown: {
    basePrice: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    discounts: number;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentId?: string;
  
  promoCode?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  hostConfirmation: "pending" | "confirmed" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

// Virtual for calculating nights
interface IBookingMethods {
  nights: number;
}

const bookingSchema = new Schema<IBooking, Model<IBooking>, IBookingMethods>(
  {
    bookingId: { 
      type: String, 
      unique: true, 
      default: () => uuidv4(),
      index: true 
    },
    listing: { 
      type: Schema.Types.ObjectId, 
      ref: "Listing", 
      required: true,
      index: true 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    host: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    checkIn: { type: Date, required: true, index: true },
    checkOut: { type: Date, required: true, index: true },
    guests: {
      adults: { type: Number, required: true, min: 1 },
      children: { type: Number, default: 0, min: 0 },
      infants: { type: Number, default: 0, min: 0 },
      pets: { type: Number, default: 0, min: 0 }
    },
    totalPrice: { type: Number, required: true, min: 0 },
    priceBreakdown: {
      basePrice: { type: Number, required: true, min: 0 },
      cleaningFee: { type: Number, default: 0, min: 0 },
      serviceFee: { type: Number, default: 0, min: 0 },
      taxes: { type: Number, default: 0, min: 0 },
      discounts: { type: Number, default: 0, min: 0 }
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true
    },
    paymentId: { type: String, sparse: true },
    
    promoCode: { type: String, sparse: true },
    notes: { type: String, maxlength: 500 },
    cancellationReason: { type: String, maxlength: 500 },
    cancelledAt: { type: Date },
    hostConfirmation: {
      type: String,
      enum: ["pending", "confirmed", "declined"],
      default: "pending",
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for better query performance
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ host: 1, status: 1 });
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for calculating nights
bookingSchema.virtual('nights').get(function() {
  const diffTime = Math.abs(this.checkOut.getTime() - this.checkIn.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for total guests
bookingSchema.virtual('totalGuests').get(function() {
  return this.guests.adults + this.guests.children + this.guests.infants;
});

// Ensure virtuals are included in JSON output
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Pre-save middleware to validate dates
bookingSchema.pre('save', function(next) {
  if (this.checkIn >= this.checkOut) {
    next(new Error('Check-out date must be after check-in date'));
  }
  
  if (this.checkIn < new Date()) {
    next(new Error('Check-in date cannot be in the past'));
  }
  
  next();
});

export const BookingModel: Model<IBooking> = mongoose.model<IBooking>("Booking", bookingSchema);
