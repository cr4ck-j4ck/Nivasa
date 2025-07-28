import type { Iuser } from "@/@Types/interfaces";
import { create } from "zustand";

export interface IuserStore {
  user: Iuser | null;
  setUser: (user: Iuser) => void;
}

const UserStore = create<IuserStore>((set) => ({
  user: null,
  setUser: (user: Iuser) => {
    set({ user });
  },
}));

export default UserStore;
