import express from "express";
import { 
  getListingReviews, 
  createReview, 
  updateReview, 
  deleteReview,
  getReviewStats 
} from "../Controllers/ReviewController";
import { authenticateToken } from "../JWT/JWT";
import { validate } from "../utils/validate";
import { z } from "zod";
import {
  listingIdParamSchema,
  reviewIdParamSchema,
  createReviewSchema,
  updateReviewSchema
} from "../Schemas/review.Zodschema";

const router = express.Router();

const listingIdValidation = z.object({ params: listingIdParamSchema });
const reviewIdValidation = z.object({ params: reviewIdParamSchema });
const createReviewValidation = z.object({ body: createReviewSchema });
const updateReviewValidation = z.object({ params: reviewIdParamSchema, body: updateReviewSchema });


// Get all reviews for a specific listing
router.get("/listing/:listingId", validate(listingIdValidation), getListingReviews);

// Get review statistics for a listing (average rating, count, etc.)
router.get("/listing/:listingId/stats", validate(listingIdValidation), getReviewStats);

// Create a new review (requires authentication)
router.post("/", authenticateToken, validate(createReviewValidation), createReview);

// Update a review (requires authentication)
router.put("/:reviewId", authenticateToken, validate(updateReviewValidation), updateReview);

// Delete a review (requires authentication)
router.delete("/:reviewId", authenticateToken, validate(reviewIdValidation), deleteReview);

export default router;