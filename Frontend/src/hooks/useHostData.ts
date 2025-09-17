// @ts-nocheck
import { useState, useEffect } from 'react';
import { getHostListings, getHostStats, getHostBookings } from '@/Services/listing.api';

export interface HostListing {
  _id: string;
  title: string;
  description: string;
  propertyType: string;
  typeOfPlace: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  createdAt: string;
  updatedAt: string;
  gallery: Record<string, string[]>;
  pricing: {
    weekdayPrice: number;
    weekendPrice: number;
  };
  location: {
    address: {
      city: string;
      state: string;
      country: string;
    };
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  rejectionReason?: string;
}

export interface HostStats {
  pending: number;
  approved: number;
  rejected: number;
  draft: number;
  total: number;
}

export interface HostBooking {
  _id: string;
  listing: {
    title: string;
    gallery: Record<string, string[]>;
  };
  guest: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface HostData {
  listings: HostListing[];
  stats: HostStats;
  bookings: HostBooking[];
  reviews: any[]; // We'll implement this later when review endpoints are available
  loading: boolean;
  error: string | null;
}

export const useHostData = () => {
  const [hostData, setHostData] = useState<HostData>({
    listings: [],
    stats: {
      pending: 0,
      approved: 0,
      rejected: 0,
      draft: 0,
      total: 0,
    },
    bookings: [],
    reviews: [],
    loading: true,
    error: null,
  });

  const fetchHostData = async () => {
    try {
      setHostData(prev => ({ ...prev, loading: true, error: null }));

      const [listingsResponse, statsResponse, bookingsResponse] = await Promise.allSettled([
        getHostListings(),
        getHostStats(),
        getHostBookings(),
      ]);

      const listings = listingsResponse.status === 'fulfilled' ? listingsResponse.value.listings || [] : [];
      const stats = statsResponse.status === 'fulfilled' ? statsResponse.value.stats || {
        pending: 0,
        approved: 0,
        rejected: 0,
        draft: 0,
        total: 0,
      } : {
        pending: 0,
        approved: 0,
        rejected: 0,
        draft: 0,
        total: 0,
      };
      const bookings = bookingsResponse.status === 'fulfilled' ? bookingsResponse.value.bookings || [] : [];

      setHostData({
        listings,
        stats,
        bookings,
        reviews: [], // TODO: Implement when review endpoints are available
        loading: false,
        error: null,
      });
    } catch (error) {
      setHostData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch host data',
      }));
    }
  };

  useEffect(() => {
    fetchHostData();
  }, []);

  return { ...hostData, refetch: fetchHostData };
};