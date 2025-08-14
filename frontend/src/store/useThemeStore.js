import {create} from 'zustand'

export const useThemeStore = create((set)=>({
    theme:localStorage.getItem("conlea-theme")|| "coffee",
    setTheme :(theme)=>{
        localStorage.setItem("conlea-theme",theme)
        set({theme})
    }
}))