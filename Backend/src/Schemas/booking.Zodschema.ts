import { z } from 'zod';

export const bookingIdParamSchema = z.object({
  bookingId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid booking ID format',
  }),
});

export const checkAvailabilitySchema = z.object({
  listingId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val)),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const calculatePricingSchema = z.object({
  listingId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val)),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const createBookingSchema = z.object({
  listingId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val)),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  guests: z.number().min(1),
});