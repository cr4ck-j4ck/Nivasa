import mongoose, { Schema, Document, Types } from "mongoose";

// TypeScript Interface for type safety
export interface IReview extends Document {
  user: Types.ObjectId; // Guest (who wrote the review)
  listing: Types.ObjectId; // Property being reviewed
  rating: number; // Rating 1-5
  reviewText: string; // Guest's feedback
  hostReply?: {
    hostId: Types.ObjectId;
    text: string;
    repliedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      trim: true,
      required: true,
    },
    hostReply: {
      hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, trim: true },
      repliedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews by the same user for the same listing
reviewSchema.index({ user: 1, listing: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
