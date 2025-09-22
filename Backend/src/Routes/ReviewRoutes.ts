import express from "express";
import { 
  getListingReviews, 
  createReview, 
  updateReview, 
  deleteReview,
  getReviewStats 
} from "../Controllers/ReviewController";
import { authenticateToken } from "../JWT/JWT";

const router = express.Router();

// Get all reviews for a specific listing
router.get("/listing/:listingId", getListingReviews);

// Get review statistics for a listing (average rating, count, etc.)
router.get("/listing/:listingId/stats", getReviewStats);

// Create a new review (requires authentication)
router.post("/", authenticateToken, createReview);

// Update a review (requires authentication)
router.put("/:reviewId", authenticateToken, updateReview);

// Delete a review (requires authentication)
router.delete("/:reviewId", authenticateToken, deleteReview);

export default router;