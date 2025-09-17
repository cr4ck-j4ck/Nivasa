interface Iavailability {
  startDate: Date;
  endDate: Date;
}

type TamenitiesStr =
  | "WiFi"
  | "Kitchen"
  | "Air conditioning"
  | "Washer"
  | "Dryer"
  | "Heating"
  | "Coffee maker"
  | "Smart TV"
  | "Parking"
  | "Elevator"
  | "Hot water"
  | "Washing machine"
  | "Geyser"
  | "Basic cooking essentials"
  | "Balcony"
  | "Free parking on premises"
  | "Workplace friendly"
  | "Essentials"
  | "Gym"
  | "Pool (shared)"
  | "Security cameras"
  | "Coffee Maker"
  | "Terrace"
  | "Panoramic Windows"
  | "Dishwasher"
  | "Closet Storage"
  | "Laundry Area"
  | "Dining Table"
  | "Exterior Space"
  | "WC"
  | "Patio"
  | "Front Garden"
  | "Garage"
  | "Garbage Bin Room"
  | "Scenic Views"
  | "Multiple Bedrooms"
  | "Air Conditioning"
  | "Balcony View"
  | "Private Pool"
  | "Dedicated Worktable"
  | "Lawn Area"
  | "Garden Space"
  | "Kitchenette"
  | "Workspace"
  | "Heritage View"
  | "RO Water Connection"
  | "Spacious Living Area"
  | "Spacious Living Room"
  | "Fully Functional Kitchen"
  | "Well-Ventilated Balcony"
  | "24x7 Security with CCTV"
  | "Elevator Access"
  | "Dedicated Workspace"
  | "Secure Building"
  | "Cinema Room"
  | "Games Room"
  | "Library"
  | "Private Garden"
  | "Full Kitchen"
  | "Office Workspace"
  | "Fairy Lighting"
  | "Back Garden"
  | "Private Balcony"
  | "Spacious Parking"
  | "Children's Playroom"
  | "Modern Living Room"
  | "High-Speed WiFi"
  | "Central Air Conditioning"
  | "Balcony with City View"
  | "Private Rooftop Lounge"
  | "Gym & Spa Access"
  | "Dedicated Work Space"
  | "24/7 Security"
  | "Luxury Furnishings"
  | "Private Parking"
  | "Balcony with Scenic Views"
  | "Laundry Room"
  | "Private Balconies"
  | "Garden Area"
  | "Balcony with Scenic View"
  | "Complimentary Breakfast"
  | "Golf Course Access"
  | "Private Balcony with Scenic View"
  | "Swimming Pool & Clubhouse"
  | "Elegant Dining Space"
  | "Children's Playroom"
  | "55-inch Smart TV with Netflix & Prime"
  | "Private Terrace"
  | "Parking in Premises"
  | "Fully Equipped Kitchenette"
  | "Wine Cellar"
  | "Private Chef"
  | "Dedicated Study Space";

export type Tamenities = TamenitiesStr[];

interface Icapacity {
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
}
interface Ilocation {
  address: {
    flatHouse?: string;
    streetAddress: string;
    landmark?: string;
    district?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
// TODO add Rating field to the listing interface, not just rating but then after structure whole the code accordingly to that and also backend , like fully implement that feature in both frontend and backend
export interface IlistingObj {
  _id: string;
  id: string;
  host: string;
  title: string;
  description: string;
  location: Ilocation;
  pricing:{
    weekdayPrice: number;
    weekendPrice: number;
  }
  roomType: string;
  isLiked: boolean;
  amenities: Tamenities;
  availability: Iavailability;
  capacity: Icapacity;
  gallery: Record<string, string[]>;
  createdAt: Date;
  maxGuests:number
}

export interface IfullListing extends Omit<IlistingObj, "host"> {
  host: Ihost;
}

interface Iverification {
  emailVerified: boolean;
  phoneVerified: boolean;
  idVerified: boolean;
}

export interface Iuser {
  superhost: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: number;
  avatar: string;
  isHost: boolean;
  bio: string;
  location: string;
  verification: Iverification;
  verified: boolean;
  savedListings: string[];
  bookings: string[];
  createdAt: string;
}

export interface Ihost extends Iuser {
  hostedListings: string[];
}

export interface IBookingDates {
  checkIn: Date | null;
  checkOut: Date | null;
}

export type TFocInput = "input1" | "input2" | null;

export interface Iform {
  username: string;
  fullName: string;
}
