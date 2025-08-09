import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMyFriends, getRecommendedUsers, sendFriednRequest } from '../controllers/user.controller.js';

const router = express.Router()

router.use(protectRoute)

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id',sendFriednRequest)

export default router;