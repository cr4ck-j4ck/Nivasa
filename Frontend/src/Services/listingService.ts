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

export interface CreateListingResponse {
  success: boolean;
  message: string;
  listing: any;
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
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to create listing');
    }
    throw new Error('An unexpected error occurred');
  }
};