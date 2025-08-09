import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriednRequest, getMyFriends, getRecommendedUsers, sendFriednRequest } from '../controllers/user.controller.js';

const router = express.Router()

router.use(protectRoute)

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id',sendFriednRequest)
router.put('/friend-request/:id/accept',acceptFriednRequest)
// TODO : Implement reject friend request endpoint


export default router;