
// @ts-nocheck

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API || 'http://localhost:3000';

export interface CreateListingData {
  title: string;
  description: string;
  propertyType: string;
  typeOfPlace: string;
  highlight: string[];
  address: {
    flatHouse?: string;
    streetAddress: string;
    landmark?: string;
    district?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: string[];
  pricing: {
    weekdayPrice: number;
    weekendPrice: number;
  };
  images: string[]; // base64 strings
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  propertyType: string;
  typeOfPlace: string;
  highlight: string[];
  address: CreateListingData['address'];
  coordinates: CreateListingData['coordinates'];
  capacity: CreateListingData['capacity'];
  amenities: string[];
  pricing: CreateListingData['pricing'];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingResponse {
  success: boolean;
  message: string;
  listing: Listing;
}

export interface ListingCard {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  gallery?: {
    [roomType: string]: string[];
  };
  location: {
    address: {
        city: string;
      }
  };
  createdAt: string;
  isLiked?: boolean;
}

export interface CityWithListings {
  city: string;
  listings: ListingCard[];
  totalCount: number;
}

// Convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const createListing = async (data: CreateListingData): Promise<CreateListingResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-listing`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to create listing');
  }
};

export const getCitiesWithListings = async (): Promise<CityWithListings[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cities-with-listings`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch cities with listings');
  }
};