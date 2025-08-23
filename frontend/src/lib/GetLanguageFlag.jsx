import { LANGUAGE_TO_FLAG } from "../constants/constants"

export const GetLanguageFlag = (language)=>{
    if(!language)return null

    const langLower = language.toLowerCase()
    const countryCode = LANGUAGE_TO_FLAG[langLower]

    if(countryCode){
        return (
            <img
                src= {`https://flagcdn.com/24x18/${countryCode}.png`}
                alt={`${countryCode}`}
                className="h-3 mr-1 inline-block"
            />
        )
    }
    return null;
}