import { z } from 'zod';

export const listingIdParamSchema = z.object({
  listingId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid listing ID format',
  }),
});

export const reviewIdParamSchema = z.object({
  reviewId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid review ID format',
  }),
});

export const createReviewSchema = z.object({
  listingId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val)),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).max(1000).optional(),
});