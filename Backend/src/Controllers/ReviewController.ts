import { Request, Response } from "express";
import { Review, IReview } from "../Models/ReviewModel";
import { BookingModel } from "../Models/BookingModel";
import mongoose from "mongoose";

// Get all reviews for a specific listing
export const getListingReviews = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const reviews = await Review.find({ listing: listingId })
      .populate("user", "firstName lastName avatar")
      .populate("hostReply.hostId", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ listing: listingId });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasMore: skip + reviews.length < totalReviews
      }
    });
  } catch (error) {
    console.error("Error fetching listing reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get review statistics for a listing
export const getReviewStats = async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const stats = await Review.aggregate([
      { $match: { listing: new mongoose.Types.ObjectId(listingId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating"
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          }
        }
      });
    }

    const { averageRating, totalReviews, ratingDistribution } = stats[0];

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingDistribution.forEach((rating: number) => {
      distribution[rating as keyof typeof distribution]++;
    });

    res.status(200).json({
      success: true,
      data: {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews,
        ratingDistribution: distribution
      }
    });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { listing, rating, reviewText } = req.body;
    const userId = (req.user as any)?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(listing)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    // Check if user has a completed booking for this listing
    const completedBooking = await BookingModel.findOne({
      user: userId,
      listing: listing,
      status: "completed"
    });

    if (!completedBooking) {
      return res.status(403).json({ 
        message: "You can only review listings you have stayed at" 
      });
    }

    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({
      user: userId,
      listing: listing
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already reviewed this listing" 
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "Rating must be between 1 and 5" 
      });
    }

    // Validate review text
    if (!reviewText || reviewText.trim().length < 10) {
      return res.status(400).json({ 
        message: "Review text must be at least 10 characters long" 
      });
    }

    const newReview = new Review({
      user: userId,
      listing,
      rating,
      reviewText: reviewText.trim()
    });

    await newReview.save();

    // Populate user data for response
    await newReview.populate("user", "firstName lastName avatar");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = (req.user as any)?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ 
        message: "You can only update your own reviews" 
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        message: "Rating must be between 1 and 5" 
      });
    }

    // Validate review text if provided
    if (reviewText && reviewText.trim().length < 10) {
      return res.status(400).json({ 
        message: "Review text must be at least 10 characters long" 
      });
    }

    // Update fields if provided
    if (rating) review.rating = rating;
    if (reviewText) review.reviewText = reviewText.trim();

    await review.save();
    await review.populate("user", "firstName lastName avatar");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = (req.user as any)?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ 
        message: "You can only delete your own reviews" 
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};