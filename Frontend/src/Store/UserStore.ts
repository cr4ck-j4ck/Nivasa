import type { Iuser } from "@/@Types/interfaces";
import { create } from "zustand";

export type TgettingUser = "fullfilled" | "pending" | "error" | "idle";
export interface IuserStore {
  user: Iuser | null;
  setUser: (user: Iuser) => void;
  updateUser: (updates: Partial<Iuser>) => void;
  isGettingUser: TgettingUser;
  setIsGettingUser: (toUpdate: TgettingUser) => void;
}

const UserStore = create<IuserStore>((set, get) => ({
  user: null,
  setUser: (user: Iuser) => {
    set({ user });
  },
  updateUser: (updates: Partial<Iuser>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updates } });
    }
  },
  isGettingUser: "idle",
  setIsGettingUser(toUpdate) {
    set({ isGettingUser: toUpdate });
  },
}));

export default UserStore;
