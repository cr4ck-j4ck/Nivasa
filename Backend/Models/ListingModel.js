const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertySchema = new Schema({
  host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    enum: ['Entire home/apt', 'Private room', 'Shared room'],
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
    of: [String]
  },
  createdAt: { type: Date, default: Date.now },
},{versionKey: false});

const ListingsModel = mongoose.model('Listing', propertySchema);
module.exports = ListingsModel;
