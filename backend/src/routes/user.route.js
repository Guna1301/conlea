import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriednRequest, getFriendRequests, getMyFriends, getOutgoingFriendRequests, getRecommendedUsers, getUserProfile, rejectFriendRequest, removeFriend, sendFriednRequest } from '../controllers/user.controller.js';

const router = express.Router()

router.use(protectRoute)

router.get('/profile/:id', getUserProfile);

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id',sendFriednRequest)
router.put('/friend-request/:id/accept',acceptFriednRequest)
router.delete('/friend-request/:id/reject',rejectFriendRequest )
router.put('/friend/:id/remove',removeFriend)

router.get('/friend-requests',getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendRequests);


export default router;