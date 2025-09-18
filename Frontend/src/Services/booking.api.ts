import axios, { AxiosError } from "axios";

const BackendAPI = import.meta.env.VITE_BACKEND_API;

export interface IBooking {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  listing: {
    _id: string;
    title: string;
    gallery: Record<string, string[]>;
    location: {
      address: {
        city: string;
        state: string;
        country: string;
      };
    };
    pricing: {
      weekdayPrice: number;
      weekendPrice: number;
    };
  };
  host: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  totalPrice: number;
  priceBreakdown: {
    basePrice: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    discounts: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  promoCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBookingResponse {
  success: boolean;
  bookings: IBooking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IDashboardStats {
  totalBookings: number;
  activeBookings: number;
  upcomingBookings: number;
  pastBookings: number;
  totalSpending: number;
  monthlySpending: number;
  averageRating: number;
  totalReviews: number;
  wishlistCount: number;
}

export const getUserBookings = async (
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<IBookingResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status && status !== 'all') {
      params.append('status', status);
    }

    const res = await axios.get(`${BackendAPI}/api/bookings/user?${params.toString()}`, {
      withCredentials: true,
    });
    
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || 'Failed to fetch bookings');
    }
    throw new Error('An error occurred while fetching bookings');
  }
};

export const getDashboardStats = async (): Promise<IDashboardStats> => {
  try {
    // Fetch all necessary data in parallel
    const [bookingsRes, wishlistRes] = await Promise.all([
      getUserBookings('all', 1, 100), // Get all bookings for stats
      axios.get(`${BackendAPI}/user/getWishlist`, { withCredentials: true })
    ]);

    const bookings = bookingsRes.bookings;
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate stats
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => 
      b.status === 'confirmed' && new Date(b.checkIn) <= now && new Date(b.checkOut) >= now
    ).length;
    
    const upcomingBookings = bookings.filter(b => 
      (b.status === 'confirmed' || b.status === 'pending') && new Date(b.checkIn) > now
    ).length;
    
    const pastBookings = bookings.filter(b => 
      new Date(b.checkOut) < now
    ).length;

    const totalSpending = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const monthlySpending = bookings
      .filter(b => 
        b.status !== 'cancelled' && 
        new Date(b.createdAt) >= currentMonth
      )
      .reduce((sum, b) => sum + b.totalPrice, 0);

    // For now, we'll use placeholder values for reviews since we don't have a reviews API
    const averageRating = 4.9;
    const totalReviews = pastBookings; // Assume one review per past booking

    const wishlistCount = Array.isArray(wishlistRes.data) ? wishlistRes.data.length : 0;

    return {
      totalBookings,
      activeBookings,
      upcomingBookings,
      pastBookings,
      totalSpending,
      monthlySpending,
      averageRating,
      totalReviews,
      wishlistCount,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || 'Failed to fetch dashboard stats');
    }
    throw new Error('An error occurred while fetching dashboard stats');
  }
};

export const getRecentActivity = async (): Promise<any[]> => {
  try {
    // Get recent bookings for activity
    const bookingsRes = await getUserBookings('all', 1, 5);
    const recentBookings = bookingsRes.bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    return recentBookings.map(booking => ({
      action: `Booking ${booking.status}`,
      location: booking.listing.title,
      time: formatTimeAgo(new Date(booking.createdAt)),
      type: 'booking',
      status: booking.status
    }));
  } catch (err) {
    console.error('Error fetching recent activity:', err);
    return [];
  }
};

// Helper function to format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};