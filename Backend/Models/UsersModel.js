// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  isHost: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  verification: {
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    idVerified: {
      type: Boolean,
      default: false
    }
  },
  savedListings: [{
    type: Schema.Types.ObjectId,
    ref: 'Listing'
  }],
  hostedListings: [{
    type: Schema.Types.ObjectId,
    ref: 'Listing'
  }],
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true, versionKey: false, });

module.exports = mongoose.model('User', userSchema);
