import type { IlistingObj } from "./interfaces";

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



export interface BookingData {
  _id?: string;
  listing: IlistingObj;
  checkIn: Date;
  checkOut: Date;
  guests: GuestCount;
  pricing: PricingBreakdown;
  promoCode?: string;
  notes?: string;
}

export type BookingStep = 'dates' | 'review' | 'success';

