import {create} from 'zustand'

export const useThemeStore = create((set)=>({
    theme:localStorage.getItem("conlea-theme")|| "forest",
    setTheme :(theme)=>{
        localStorage.setItem("conlea-theme",theme)
        set({theme})
    }
}))