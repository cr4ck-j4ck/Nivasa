import { create } from "zustand";

type TerrorObj = { emailError : string | null} | { passwordError : string | null}

export interface IglobalStore{
    emailError:string | null;
    passwordError:string | null;
    setErrorFromBackend:(toUpdate : TerrorObj)=>void;
    mainPageMsg:string |null;
    setMainPageMsg:(toUpdate : string|null)=>void;
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
    }
}))

export default globalStore;