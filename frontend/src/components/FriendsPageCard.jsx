import { useMutation, useQueryClient } from "@tanstack/react-query"
import { GetLanguageFlag } from "../lib/GetLanguageFlag"
import { removeFriend } from "../lib/api"


const FriendsPageCard = ({friend}) => {

  console.log(friend)
  const queryClinet = useQueryClient()

  const {mutate:removeFriendMutation, isPending} = useMutation({
    mutationFn:removeFriend,
    onSuccess : ()=>{
      queryClinet.invalidateQueries(['friendRequests'])
      queryClinet.invalidateQueries(['friends'])
    }
  })

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

            <div className="ml-4">
              <button
                className='btn btn-error btn-sm'
                onClick={()=>removeFriendMutation(friend._id)}
                disabled= {isPending}
              >
                Remove Friend
              </button>
            </div>
        </div>
    </div>

  )
}

export default FriendsPageCard