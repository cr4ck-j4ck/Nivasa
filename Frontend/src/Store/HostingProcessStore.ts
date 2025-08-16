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

// 👇 Define Image type (can be File or string if uploaded to server/CDN)
interface HostingImage {
  id: string; // unique identifier (e.g., uuid)
  file: File; // or URL string if already uploaded
  url:string;
  order:number;
}

interface HostingProcessState {
  address: Iaddress | null;
  coordinates: Coordinates | null;
  images: HostingImage[];

  setAddress: (address: Iaddress) => void;
  setCoordinates: (coords: Coordinates) => void;

  addImage: (image: HostingImage[]) => void;
  removeImage: (id: string) => void;
  reorderImages: (images: HostingImage[]) => void;

  reset: () => void;
}

export const useHostingProcessStore = create<HostingProcessState>((set) => ({
  address: null,
  coordinates: null,
  images: [],

  // Update address
  setAddress: (address) => set({ address }),

  // Update coordinates
  setCoordinates: (coords) => set({ coordinates: coords }),

  // Add image
  addImage: (image) =>
    set((state) => ({
      images: [...state.images, ...image],
    })),

  // Remove image by id
  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),

  // Reorder images (useful for drag & drop)
  reorderImages: (images) => set({ images }),

  // Reset to initial state
  reset: () => set({ address: null, coordinates: null, images: [] }),
}));
