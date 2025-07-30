import { create } from "zustand";

type TerrorObj = { emailError : string | null} | { passwordError : string | null}

export interface IglobalStore{
    emailError:string | null;
    passwordError:string | null;
    setErrorFromBackend:(toUpdate : TerrorObj)=>void;
}

const globalStore = create<IglobalStore>(set => ({
    emailError:null,
    passwordError:null,
    setErrorFromBackend(toUpdate) {
        set(toUpdate)
    },
}))

export default globalStore;