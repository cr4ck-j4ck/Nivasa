import { z } from 'zod';

export const listingIdParamSchema = z.object({
  id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid listing ID format',
  }),
});

export const cityParamSchema = z.object({
  city: z.string().min(1),
});

export const createListingSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  price: z.number().positive(),
  location: z.object({
    address: z.string().min(5),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
  }),
  guests: z.number().int().positive(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  amenities: z.array(z.string()).optional(),
});

export const searchListingsSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  maxPrice: z.preprocess((val) => Number(val), z.number().positive().optional()),
  guests: z.preprocess((val) => Number(val), z.number().int().positive().optional()),
});

export const updateListingStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
});