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

interface HostingProcessState {
  address: Iaddress | null;
  coordinates: Coordinates | null;
  setAddress: (address: Iaddress) => void;
  setCoordinates: (coords: Coordinates) => void;
  reset: () => void;
}

export const useHostingProcessStore = create<HostingProcessState>((set) => ({
  address: null,
  coordinates: null,

  // Update address (e.g. after user picks location on map)
  setAddress: (address) => set({ address }),

  // Update coordinates (lat/lng)
  setCoordinates: (coords) => set({ coordinates: coords }),

  // Reset to initial state
  reset: () => set({ address: null, coordinates: null }),
}));
