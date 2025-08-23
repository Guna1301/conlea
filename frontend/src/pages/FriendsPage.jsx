import {useQuery} from '@tanstack/react-query'
import { getUserFriends } from '../lib/api'
import NoFriendsFound from '../components/NoFriendsFound'
import FriendsPageCard from '../components/FriendsPageCard'

const FriendsPage = () => {
  const {data:friends=[],isLoading:loadingFriends }= useQuery({
    queryKey:['friends'],
    queryFn: getUserFriends,
  })
  return (
    <div className='bg-base-100 rounded-lg p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
        </div>

        {
          loadingFriends?(
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg'/>
            </div>
          ):friends.length === 0 ?(
            <NoFriendsFound/>
          ):(
            <div className='space-y-4 gap-4'>
              {
                friends.map((friend) =>(
                  <FriendsPageCard key={friend._id} friend={friend}/>
                ))
              }
            </div>
          )
        }
      </div>
      
    </div>
  )
}

export default FriendsPage