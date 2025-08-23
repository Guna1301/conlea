import { GetLanguageFlag } from "../lib/GetLanguageFlag"


const FriendsPageCard = ({friend}) => {
  return (
    <div className="card bg-base-300 hover:shadow-md transition-shadow w-full">
        <div className="card-body p-4 flex flex-row items-center justify-between">
            
            {/* avatar */}
            <div className="avatar size-16 mr-4">
            <img src={friend.profilePic} alt={friend.fullName} className="rounded-full"/>
            </div>
            
            {/* info section */}
            <div className="flex-1">
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
            <p className="text-sm opacity-70">{friend.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="badge badge-secondary text-xs">
                {GetLanguageFlag(friend.nativeLanguage)} Native: {friend.nativeLanguage}
                </span>
                <span className="badge badge-outline text-xs">
                {GetLanguageFlag(friend.learningLanguage)} Learning: {friend.learningLanguage}
                </span>
            </div>
            </div>

            {/* actions */}
            <div className="ml-4">
            <button className="btn btn-error btn-sm">Remove Friend</button>
            </div>
        </div>
    </div>

  )
}

export default FriendsPageCard

// export const getLanguageFlag = (language)=>{
//     if(!language)return null

//     const langLower = language.toLowerCase()
//     const countryCode = LANGUAGE_TO_FLAG[langLower]

//     if(countryCode){
//         return (
//             <img
//                 src= {`https://flagcdn.com/24x18/${countryCode}.png`}
//                 alt={`${countryCode}`}
//                 className="h-3 mr-1 inline-block"
//             />
//         )
//     }
//     return null;
// }


