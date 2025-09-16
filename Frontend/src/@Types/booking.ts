export interface GuestCount {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface PricingBreakdown {
  basePrice: number;
  nights: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  totalPrice: number;
}

export interface BookingListing {
  _id: string;
  title: string;
  images: string[];
  pricing: {
    weekdayPrice: number;
    weekendPrice: number;
  };
  host: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  location: {
    address: {
      city: string;
      state?: string;
    };
  };
  maxGuests: number;
  rating?: number;
  reviewCount?: number;
}

export interface BookingData {
  _id?: string;
  listing: BookingListing;
  checkIn: Date;
  checkOut: Date;
  guests: GuestCount;
  pricing: PricingBreakdown;
  promoCode?: string;
  notes?: string;
}

export type BookingStep = 'dates' | 'review' | 'success';

