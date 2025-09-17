/*  */import { Router } from "express";
import {
  checkAvailability,
  calculatePricing,
  createBooking,
  getUserBookings,
  getHostBookings,
  getBookingById,
  cancelBooking
} from "../Controllers/BookingController";
import { verifyToken } from "../JWT/JWT";
import asyncWrapper from "../utils/wrapAsync";

const router = Router();

// Public routes
router.get("/availability", asyncWrapper(checkAvailability));
router.get("/calculate-pricing", asyncWrapper(calculatePricing));

// Protected routes (require authentication)
router.use(verifyToken);

// Booking management
router.post("/", asyncWrapper(createBooking));
router.get("/user", asyncWrapper(getUserBookings));
router.get("/host", asyncWrapper(getHostBookings));
router.get("/:bookingId", asyncWrapper(getBookingById));
router.put("/:bookingId/cancel", asyncWrapper(cancelBooking));

export default router;