import type { Iuser } from "@/@Types/interfaces";
import { create } from "zustand";

export type TgettingUser = "fullfilled" | "pending" | "error" | "idle";
export interface IuserStore {
  user: Iuser | null;
  setUser: (user: Iuser) => void;
  isGettingUser: TgettingUser;
  setIsGettingUser: (toUpdate: TgettingUser) => void;
}

const UserStore = create<IuserStore>((set) => ({
  user: null,
  setUser: (user: Iuser) => {
    set({ user });
  },
  isGettingUser: "idle",
  setIsGettingUser(toUpdate) {
    set({ isGettingUser: toUpdate });
  },
}));

export default UserStore;
