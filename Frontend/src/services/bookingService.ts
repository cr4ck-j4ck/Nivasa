import axios from 'axios';
import { createErrorResponse } from '../utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API;

export interface BookingData {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  pricing: {
    total: number;
    breakdown: {
      basePrice: number;
      nights: number;
      subtotal: number;
      cleaningFee: number;
      serviceFee: number;
      taxes: number;
      discount: number;
    };
  };
  paymentMethodId: string;
  promoCode?: string;
  specialRequests?: string;
}

export interface BookingResponse {
  success: boolean;
  booking?: {
    _id: string;
    listingId: string;
    checkIn: string;
    checkOut: string;
    guests: {
      adults: number;
      children: number;
      infants: number;
      pets: number;
    };
    pricing: {
      total: number;
      breakdown: {
        basePrice: number;
        nights: number;
        subtotal: number;
        cleaningFee: number;
        serviceFee: number;
        taxes: number;
        discount: number;
      };
    };
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
  error?: string;
}

export interface PricingResponse {
  success: boolean;
  pricing?: {
    basePrice: number;
    nights: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    discount: number;
    total: number;
  };
  message?: string;
}

export interface AvailabilityResponse {
  success: boolean;
  available?: boolean;
  message?: string;
}

class BookingService {
  private axiosConfig = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Check availability for specific dates
  async checkAvailability(
    listingId: string,
    checkIn: string,
    checkOut: string
  ): Promise<AvailabilityResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/availability`,
        {
          params: { listingId, checkIn, checkOut },
          ...this.axiosConfig,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      return createErrorResponse(error, 'Failed to check availability');
    }
  }

  // Calculate pricing for booking
  async calculatePricing(
    listingId: string,
    checkIn: string,
    checkOut: string,
    guests: number,
    promoCode?: string
  ): Promise<PricingResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/pricing`,
        {
          params: { listingId, checkIn, checkOut, guests, promoCode },
          ...this.axiosConfig,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error calculating pricing:', error);
      return createErrorResponse(error, 'Failed to calculate pricing');
    }
  }

  // Create a new booking
  async createBooking(bookingData: BookingData): Promise<BookingResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        bookingData,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      return createErrorResponse(error, 'Failed to create booking');
    }
  }

  // Process payment for booking
  async processPayment(
    paymentMethodId: string,
    amount: number,
    bookingId?: string
  ): Promise<BookingResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/bookings/payment`,
        { paymentMethodId, amount, bookingId },
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      return createErrorResponse(error, 'Payment failed');
    }
  }

  // Get user's bookings
  async getUserBookings(page = 1, limit = 10): Promise<BookingResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/user`,
        {
          params: { page, limit },
          ...this.axiosConfig,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return {
        success: false,
        message: createErrorResponse(error, 'Failed to fetch bookings').message,
      };
    }
  }

  // Get host's bookings
  async getHostBookings(page = 1, limit = 10): Promise<BookingResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/host`,
        {
          params: { page, limit },
          ...this.axiosConfig,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching host bookings:', error);
      return {
        success: false,
        message: createErrorResponse(error, 'Failed to fetch bookings').message,
      };
    }
  }

  // Get booking by ID
  async getBookingById(bookingId: string): Promise<BookingResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/${bookingId}`,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        message: createErrorResponse(error, 'Failed to fetch booking').message,
      };
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<BookingResponse> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/bookings/${bookingId}/cancel`,
        { reason },
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        message: createErrorResponse(error, 'Failed to cancel booking').message,
      };
    }
  }

  // Validate promo code
  async validatePromoCode(code: string, listingId: string): Promise<BookingResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/bookings/validate-promo`,
        { code, listingId },
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error('Error validating promo code:', error);
      return {
        success: false,
        message: createErrorResponse(error, 'Invalid promo code').message,
      };
    }
  }

  // Get booking analytics (for hosts)
  async getBookingAnalytics(timeframe = '30d'): Promise<BookingResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/analytics`,
        {
          params: { timeframe },
          ...this.axiosConfig,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching booking analytics:', error);
      return {
        success: false,
        message: createErrorResponse(error, 'Failed to fetch analytics').message,
      };
    }
  }
}

export default new BookingService();