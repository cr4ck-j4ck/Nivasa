import { create } from "zustand";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Iaddress {
  region: string;
  propertyNumber: string;
  streetAddress: string;
  landmark: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
}

interface HostingImage {
  id: string; // unique identifier (e.g., uuid)
  file: File; // or URL string if already uploaded
  url: string;
  order: number;
}

interface Icapacity {
  guests: number | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
}

interface IPricing {
  weekdayPrice: number | null;
  weekendPrice: number | null;
}

interface IlistingInfo {
  title: string | null;
  description: string | null;
  propertyType: string | null;
  typeOfPlace: string | null;
  capacity: Icapacity;
  amenities: string[];
  pricing: IPricing;
}

// Step validation interface
interface StepValidation {
  isValid: boolean;
  requiredFields: string[];
}

interface HostingProcessState {
  // Data fields
  address: Iaddress | null;
  coordinates: Coordinates | null;
  images: HostingImage[];
  listingInfo: IlistingInfo;
  
  // Actions
  setAddress: (address: Iaddress) => void;
  setCoordinates: (coords: Coordinates) => void;
  setPropertyType: (type: string) => void;
  setTypeOfPlace: (type: string) => void;
  setCapacity: (capacity: Icapacity) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setAmenities: (amenities: string[]) => void;
  setPricing: (pricing: IPricing) => void;
  addImage: (image: HostingImage[]) => void;
  removeImage: (id: string) => void;
  reorderImages: (images: HostingImage[]) => void;
  
  // Validation
  validateStep: (step: number) => StepValidation;
  
  reset: () => void;
}

export const useHostingProcessStore = create<HostingProcessState>((set, get) => ({
  // Initial state
  address: null,
  coordinates: null,
  listingInfo: {
    title: null,
    description: null,
    propertyType: null,
    typeOfPlace: null,
    capacity: {
      guests: null,
      bedrooms: null,
      beds: null,
      bathrooms: null,
    },
    amenities: [],
    pricing: {
      weekdayPrice: null,
      weekendPrice: null,
    },
  },
  images: [],

  // Actions
  setAddress: (address) => set({ address }),
  setCoordinates: (coords) => set({ coordinates: coords }),
  
  setPropertyType: (type) =>
    set((state) => ({
      listingInfo: { ...state.listingInfo, propertyType: type },
    })),
    
  setTypeOfPlace: (type) =>
    set((state) => ({
      listingInfo: { ...state.listingInfo, typeOfPlace: type },
    })),
    
  setCapacity: (capacity) =>
    set((state) => ({
      listingInfo: { ...state.listingInfo, capacity },
    })),
    
  setTitle: (title) =>
    set((state) => ({
      listingInfo: { ...state.listingInfo, title },
    })),
    
  setDescription: (description) =>
    set((state) => ({
      listingInfo: { ...state.listingInfo, description },
    })),
    
  setAmenities: (amenities) =>
    set((state) => ({
      listingInfo: { ...state.listingInfo, amenities },
    })),
    
  setPricing: (pricing) =>
    set((state) => ({
      listingInfo: { ...state.listingInfo, pricing },
    })),

  addImage: (image) =>
    set((state) => ({
      images: [...state.images, ...image],
    })),

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),

  reorderImages: (images) => set({ images }),

  // Validation logic for each step
  validateStep: (step: number): StepValidation => {
    const state = get();
    
    switch (step) {
      case 0: // Get Started - always valid
        return { isValid: true, requiredFields: [] };
        
      case 1: // Tell us about your place intro - always valid
        return { isValid: true, requiredFields: [] };
        
      case 2: // Choose Property Type
        return {
          isValid: !!state.listingInfo.propertyType,
          requiredFields: state.listingInfo.propertyType ? [] : ['propertyType'],
        };
        
      case 3: // Type of Place
        return {
          isValid: !!state.listingInfo.typeOfPlace,
          requiredFields: state.listingInfo.typeOfPlace ? [] : ['typeOfPlace'],
        };
        
      case 4: // Address
        return {
          isValid: !!state.address && !!state.address.city && !!state.address.state,
          requiredFields: !state.address ? ['address'] : [],
        };
        
      case 5: // Property Capacity
      {
          const capacity = state.listingInfo.capacity;
        const hasValidCapacity = capacity.guests && capacity.guests > 0 &&
                                capacity.bedrooms && capacity.bedrooms > 0 &&
                                capacity.beds && capacity.beds > 0 &&
                                capacity.bathrooms && capacity.bathrooms > 0;
        return {
          isValid: !!hasValidCapacity,
          requiredFields: hasValidCapacity ? [] : ['capacity'],
        };
      }
        
      case 6: // Make your place stand out intro - always valid
        return { isValid: true, requiredFields: [] };
        
      case 7: // Choose Amenities
        return {
          isValid: state.listingInfo.amenities.length > 0,
          requiredFields: state.listingInfo.amenities.length > 0 ? [] : ['amenities'],
        };
        
      case 8: // Photo Upload
        return {
          isValid: state.images.length >= 5,
          requiredFields: state.images.length >= 5 ? [] : ['images'],
        };
        
      case 9: // Reorder Images - valid if we have images
        return {
          isValid: state.images.length >= 5,
          requiredFields: state.images.length >= 5 ? [] : ['images'],
        };
        
      case 10: // Property Title
        return {
          isValid: !!state.listingInfo.title && state.listingInfo.title.trim().length > 0,
          requiredFields: !state.listingInfo.title || state.listingInfo.title.trim().length === 0 ? ['title'] : [],
        };
        
      case 11: // Property Description/Tag
        return {
          isValid: !!state.listingInfo.description && state.listingInfo.description.trim().length > 0,
          requiredFields: !state.listingInfo.description || state.listingInfo.description.trim().length === 0 ? ['description'] : [],
        };
        
      case 12: // Finish up and publish intro - always valid
        return { isValid: true, requiredFields: [] };
        
      case 13: // Weekday Base Price
        return {
          isValid: !!state.listingInfo.pricing.weekdayPrice && state.listingInfo.pricing.weekdayPrice > 0,
          requiredFields: !state.listingInfo.pricing.weekdayPrice || state.listingInfo.pricing.weekdayPrice <= 0 ? ['weekdayPrice'] : [],
        };
        
      case 14: // Weekend Price
        return {
          isValid: !!state.listingInfo.pricing.weekendPrice && state.listingInfo.pricing.weekendPrice > 0,
          requiredFields: !state.listingInfo.pricing.weekendPrice || state.listingInfo.pricing.weekendPrice <= 0 ? ['weekendPrice'] : [],
        };
        
      default:
        return { isValid: true, requiredFields: [] };
    }
  },

  // Reset to initial state
  reset: () => set({ 
    address: null, 
    coordinates: null, 
    images: [],
    listingInfo: {
      title: null,
      description: null,
      propertyType: null,
      typeOfPlace: null,
      capacity: {
        guests: null,
        bedrooms: null,
        beds: null,
        bathrooms: null,
      },
      amenities: [],
      pricing: {
        weekdayPrice: null,
        weekendPrice: null,
      },
    },
  }),
}));
