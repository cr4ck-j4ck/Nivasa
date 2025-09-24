import { create } from "zustand";

type TerrorObj = { emailError : string | null} | { passwordError : string | null}

export interface IAlert {
    type: "success" | "error" | "warning" | "info";
    message: string;
}

export interface IglobalStore{
    emailError:string | null;
    passwordError:string | null;
    setErrorFromBackend:(toUpdate : TerrorObj)=>void;
    mainPageMsg:string |null;
    setMainPageMsg:(toUpdate : string|null)=>void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    alert: IAlert | null;
    setAlert: (alert: IAlert | null) => void;
    clearAlert: () => void;
}

const globalStore = create<IglobalStore>(set => ({
    emailError:null,
    passwordError:null,
    setErrorFromBackend(toUpdate) {
        set(toUpdate)
    },
    mainPageMsg:null,
    setMainPageMsg(toUpdate){
        set({mainPageMsg:toUpdate})
    },
    loading: false,
    setLoading: (loading: boolean) => {
        set({ loading });
    },
    alert: null,
    setAlert: (alert: IAlert | null) => {
        set({ alert });
    },
    clearAlert: () => {
        set({ alert: null });
    }
}))

export default globalStore;