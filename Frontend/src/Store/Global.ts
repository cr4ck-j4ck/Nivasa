import { create } from 'zustand'

export interface IglobalStore{
    showLogin:boolean;
    setShowLogin:(toUpdate:boolean)=>void;

}

export const useGlobalStore = create<IglobalStore>((set)=>({
    showLogin:false,
    setShowLogin:(toUpdate)=> {
        set({showLogin:toUpdate})
    }
}))