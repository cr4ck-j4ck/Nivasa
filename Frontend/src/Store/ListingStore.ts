import { create } from "zustand";
import type { IfullListing, IlistingObj } from "@/@Types/interfaces";


export interface IlistingState {
  listingObj: IlistingObj | IfullListing | null;
  setListingObj: (obj: IlistingObj) => void;
}
export const useListingStore = create<IlistingState>((set) => ({
  listingObj: null,
  setListingObj: (obj) => set({ listingObj: obj }),
}));