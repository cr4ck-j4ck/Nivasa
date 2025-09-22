import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";

export interface IReview {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  listing: string;
  rating: number;
  reviewText: string;
  hostReply?: {
    hostId: string;
    text: string;
    repliedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface IReviewsResponse {
  success: boolean;
  data: IReview[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    hasMore: boolean;
  };
}

export interface IReviewStatsResponse {
  success: boolean;
  data: IReviewStats;
}

// Get all reviews for a specific listing
export const getListingReviews = async (
  listingId: string,
  page: number = 1,
  limit: number = 10
): Promise<IReviewsResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/reviews/listing/${listingId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching listing reviews:", error);
    throw error;
  }
};

// Get review statistics for a listing
export const getReviewStats = async (listingId: string): Promise<IReviewStatsResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/reviews/listing/${listingId}/stats`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching review stats:", error);
    throw error;
  }
};

// Create a new review
export const createReview = async (reviewData: {
  listing: string;
  rating: number;
  reviewText: string;
}): Promise<{ success: boolean; message: string; data: IReview }> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/reviews`,
      reviewData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Update a review
export const updateReview = async (
  reviewId: string,
  reviewData: {
    rating?: number;
    reviewText?: string;
  }
): Promise<{ success: boolean; message: string; data: IReview }> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/reviews/${reviewId}`,
      reviewData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/reviews/${reviewId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};