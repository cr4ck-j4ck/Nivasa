export interface User {
  id: number;
  name: string;
  avatarUrl: string;
  email: string;
  phone?: string;
}

export interface Booking {
  id: number;
  propertyId: number;
  propertyName: string;
  startDate: string;
  endDate: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  price: number;
}

export interface Listing {
  id: number;
  title: string;
  location: string;
  pricePerNight: number;
  photoUrl: string;
  isActive: boolean;
}

export interface Review {
  id: number;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
}
