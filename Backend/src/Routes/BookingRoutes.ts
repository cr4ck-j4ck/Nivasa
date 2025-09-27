import { Router } from "express";
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
import { validate } from "../utils/validate";
import { z } from "zod";
import {
  bookingIdParamSchema,
  checkAvailabilitySchema,
  calculatePricingSchema,
  createBookingSchema
} from "../Schemas/booking.Zodschema";

const router = Router();

const checkAvailabilityValidation = z.object({ query: checkAvailabilitySchema });
const calculatePricingValidation = z.object({ query: calculatePricingSchema });
const createBookingValidation = z.object({ body: createBookingSchema });
const bookingIdParamValidation = z.object({ params: bookingIdParamSchema });

// Public routes
router.get("/availability", validate(checkAvailabilityValidation), asyncWrapper(checkAvailability));
router.get("/calculate-pricing", validate(calculatePricingValidation), asyncWrapper(calculatePricing));

// Protected routes (require authentication)
router.use(verifyToken);

// Booking management
router.post("/", validate(createBookingValidation), asyncWrapper(createBooking));
router.get("/user", asyncWrapper(getUserBookings));
router.get("/host", asyncWrapper(getHostBookings));
router.get("/:bookingId", validate(bookingIdParamValidation), asyncWrapper(getBookingById));
router.put("/:bookingId/cancel", validate(bookingIdParamValidation), asyncWrapper(cancelBooking));

export default router;