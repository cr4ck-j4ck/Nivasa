"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// 2. Define the schema with the interface
const userSchema = new mongoose_1.Schema({
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
    savedListings: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Listing" }],
    hostedListings: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Listing" }],
    bookings: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Booking" }],
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true, versionKey: false });
exports.UserModel = mongoose_1.default.model("User", userSchema);
