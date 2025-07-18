import mongoose, { Document, Model, Schema } from "mongoose";

export interface IListing extends Document {
  host: mongoose.Types.ObjectId;
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  price: number;
  roomType: "Entire home/apt" | "Private room" | "Shared room" | "Entire studio";
  amenities: string[];
  availability: {
    startDate: Date;
    endDate: Date;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  gallery: Map<string, string[]>;
}

// 2. Define the schema with the interface
const propertySchema = new Schema<IListing>(
  {
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    location: {
      city: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
    price: { type: Number, required: true },
    roomType: {
      type: String,
      enum: ["Entire home/apt", "Private room", "Shared room", "Entire studio"],
      required: true,
    },
    amenities: [String],
    availability: {
      startDate: Date,
      endDate: Date,
    },
    capacity: {
      guests: { type: Number, required: true },
      bedrooms: { type: Number, required: true },
      beds: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
    },
    gallery: {
      type: Map,
      of: [String],
    },
  },
  { versionKey: false, timestamps: true }
);


const ListingModel: Model<IListing> = mongoose.model<IListing>("Listing", propertySchema);
export default ListingModel;
