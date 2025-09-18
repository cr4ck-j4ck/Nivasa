import { Request, Response } from "express";
import { BookingModel, IBooking } from "../Models/BookingModel";
import ListingModel from "../Models/ListingModel";
import UserModel, { IUser } from "../Models/UsersModel";
import { sendBookingConfirmationEmail, sendHostNotificationEmail } from "../utils/emailService";
import { z } from "zod";

// Validation schemas
const createBookingSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.object({
    adults: z.number().min(1, "At least 1 adult required"),
    children: z.number().min(0),
    infants: z.number().min(0),
    pets: z.number().min(0),
  }),
  promoCode: z.string().optional(),
  notes: z.string().optional(),
});



interface AuthenticatedRequest extends Omit<Request, 'user'> {
  user?: IUser;
}

// Check availability for specific dates
export async function checkAvailability(req: Request, res: Response) {
  try {
    const { listingId, checkIn, checkOut } = req.query;

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Listing ID, check-in, and check-out dates are required",
      });
    }

    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);

    // Check if dates are valid
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past",
      });
    }

    // Check for existing bookings that overlap with requested dates
    const existingBookings = await BookingModel.find({
      listing: listingId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    const isAvailable = existingBookings.length === 0;

    res.json({
      success: true,
      available: isAvailable,
      conflictingBookings: existingBookings.length,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Calculate pricing for a booking
export async function calculatePricing(req: Request, res: Response) {
  try {
    const { listingId, checkIn, checkOut, guests, promoCode } = req.query;

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Listing ID, check-in, and check-out dates are required",
      });
    }

    const listing = await ListingModel.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate base price using weekday/weekend pricing
    const basePrice = listing.pricing.weekdayPrice * nights; // Simplified - could be enhanced to calculate weekday/weekend split
    const cleaningFee = 50; // Fixed cleaning fee for now
    const serviceFee = Math.round(basePrice * 0.14); // 14% service fee
    const taxes = Math.round((basePrice + serviceFee) * 0.12); // 12% taxes

    let discount = 0;
    if (promoCode) {
      // Apply promo code logic here
      if (promoCode === "WELCOME10") {
        discount = Math.round(basePrice * 0.1); // 10% discount
      }
    }

    const totalPrice = basePrice + cleaningFee + serviceFee + taxes - discount;

    res.json({
      success: true,
      pricing: {
        basePrice,
        nights,
        cleaningFee,
        serviceFee,
        taxes,
        discount,
        totalPrice,
        priceBreakdown: {
          [`$${listing.pricing.weekdayPrice} x ${nights} nights`]: basePrice,
          "Cleaning fee": cleaningFee,
          "Service fee": serviceFee,
          "Taxes": taxes,
          ...(discount > 0 && { "Discount": -discount }),
        },
      },
    });
  } catch (error) {
    console.error("Error calculating pricing:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Create a new booking
export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const validatedData = createBookingSchema.parse(req.body);
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if listing exists
    const listing = await ListingModel.findById(validatedData.listingId).populate('host');
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const checkInDate = new Date(validatedData.checkIn);
    const checkOutDate = new Date(validatedData.checkOut);

    // Check availability again
    const existingBookings = await BookingModel.find({
      listing: validatedData.listingId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Selected dates are no longer available",
      });
    }

    // Calculate pricing
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    // Calculate base price using weekday/weekend pricing
    const basePrice = listing.pricing.weekdayPrice * nights; // Simplified - could be enhanced to calculate weekday/weekend split
    const cleaningFee = 50; // Fixed cleaning fee for now
    const serviceFee = Math.round(basePrice * 0.14);
    const taxes = Math.round((basePrice + serviceFee) * 0.12);

    let discount = 0;
    if (validatedData.promoCode === "WELCOME10") {
      discount = Math.round(basePrice * 0.1);
    }

    const totalPrice = basePrice + cleaningFee + serviceFee + taxes - discount;

    // Create booking
    const booking = new BookingModel({
      user: userId,
      listing: validatedData.listingId,
      host: listing.host._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: validatedData.guests,
      totalPrice,
      priceBreakdown: {
        basePrice,
        cleaningFee,
        serviceFee,
        taxes,
        discounts: discount,
      },
      status: "confirmed", // Auto-confirm since no payment processing
      promoCode: validatedData.promoCode,
      notes: validatedData.notes,
    });

    await booking.save();

    // Update user's booking count
    await UserModel.findByIdAndUpdate(userId, {
      $push: { bookings: booking._id },
      $inc: { totalBookings: 1 }
    });

    // Populate booking for response
    const populatedBooking = await BookingModel.findById(booking._id)
      .populate('listing', 'title images location pricing')
      .populate('user', 'firstName lastName email')
      .populate('host', 'firstName lastName email');

    // Send confirmation emails
    try {
      await sendBookingConfirmationEmail(populatedBooking);
      await sendHostNotificationEmail(populatedBooking);
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }

    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}



// Get user's bookings
export async function getUserBookings(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const statusFilter = req.query.status as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Build query based on status filter
    let query: any = { user: userId };
    const now = new Date();

    if (statusFilter && statusFilter !== 'all') {
      switch (statusFilter) {
        case 'upcoming':
          query.checkIn = { $gt: now };
          query.status = { $in: ['confirmed', 'pending'] };
          break;
        case 'past':
          query.checkOut = { $lt: now };
          break;
        case 'cancelled':
          query.status = 'cancelled';
          break;
        default:
          if (['pending', 'confirmed', 'completed'].includes(statusFilter)) {
            query.status = statusFilter;
          }
      }
    }

    const bookings = await BookingModel.find(query)
      .populate('listing', 'title gallery location pricing')
      .populate('host', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await BookingModel.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNext: page * limit < totalBookings,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Get host's bookings
export async function getHostBookings(req: AuthenticatedRequest, res: Response) {
  try {
    const hostId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!hostId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookings = await BookingModel.find({ host: hostId })
      .populate('listing', 'title images location pricing')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await BookingModel.countDocuments({ host: hostId });

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNext: page * limit < totalBookings,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Get booking by ID
export async function getBookingById(req: AuthenticatedRequest, res: Response) {
  try {
    const { bookingId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const booking = await BookingModel.findById(bookingId)
      .populate('listing', 'title images location pricing amenities')
      .populate('user', 'firstName lastName email')
      .populate('host', 'firstName lastName email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user has access to this booking
    if (booking.user._id.toString() !== userId.toString() && booking.host._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to booking",
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Cancel booking
export async function cancelBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { bookingId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const booking = await BookingModel.findById(bookingId)
      .populate('listing', 'title images location pricing')
      .populate('user', 'firstName lastName email')
      .populate('host', 'firstName lastName email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns this booking
    if (booking.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to booking",
      });
    }

    // Check if booking can be cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed booking",
      });
    }

    // Check cancellation policy (24 hours before check-in)
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel booking less than 24 hours before check-in",
      });
    }

    // Update booking status
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    // Update user's booking count
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { totalBookings: -1 },
      $pull: { bookings: booking._id },
    });

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}