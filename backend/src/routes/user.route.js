import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriednRequest, getFriendRequests, getMyFriends, getOutgoingFriendRequests, getRecommendedUsers, sendFriednRequest } from '../controllers/user.controller.js';

const router = express.Router()

router.use(protectRoute)

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id',sendFriednRequest)
router.put('/friend-request/:id/accept',acceptFriednRequest)
// TODO : Implement reject friend request endpoint

router.get('/friend-requests',getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendRequests);

export default router;