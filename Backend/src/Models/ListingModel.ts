import mongoose, { Document, Model, Schema } from "mongoose";

export interface IListing extends Document {
  host: mongoose.Types.ObjectId;
  title: string;
  description: string;
  propertyType: string;
  typeOfPlace: string;
  highlight: string[];
  location: {
    address: {
      flatHouse?: string;
      streetAddress: string;
      landmark?: string;
      district?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  pricing: {
    weekdayPrice: number;
    weekendPrice: number;
  };
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
  images: string[];
  gallery: Map<string, string[]>;
  status: "pending" | "approved" | "rejected" | "draft";
  rejectionReason?: string; // Optional reason for rejection
}

// 2. Define the schema with the interface
const propertySchema = new Schema<IListing>(
  {
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    propertyType: { type: String, required: true },
    typeOfPlace: { type: String, required: true },
    highlight: [String],
    location: {
      address: {
        flatHouse: String,
        streetAddress: { type: String },
        landmark: String,
        district: String,
        city: { type: String,  },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    pricing: {
      weekdayPrice: { type: Number, required: true },
      weekendPrice: { type: Number, required: true },
    },
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
    images: [String],
    gallery: {
      type: Map,
      of: [String],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "draft"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      required: false,
    },
  },
  { versionKey: false, timestamps: true }
);

// Add indexes for better query performance
propertySchema.index({ status: 1 });
propertySchema.index({ host: 1, status: 1 });
propertySchema.index({ "location.city": 1 });


const ListingModel: Model<IListing> = mongoose.model<IListing>("Listing", propertySchema);
export default ListingModel;
