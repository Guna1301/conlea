import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const friendsList = currentUser.friends || [];

        let recommendedUsers = await User.aggregate([
            {
                $match: {
                    _id: { $ne: currentUserId },
                    _id: { $nin: friendsList },
                    isOnboarded: true,
                    $or: [
                        { nativeLanguage: currentUser.learningLanguage },
                        { learningLanguage: currentUser.nativeLanguage }
                    ]
                }
            },
            {
                $addFields: {
                    matchScore: {
                        $add: [
                            { $cond: [{ $eq: ["$nativeLanguage", currentUser.learningLanguage] }, 1, 0] },
                            { $cond: [{ $eq: ["$learningLanguage", currentUser.nativeLanguage] }, 1, 0] }
                        ]
                    }
                }
            },
            { $sort: { matchScore: -1, updatedAt: -1 } },
            { $limit: 10 },
            { $project: { password: 0, __v: 0 } }
        ]);

        if (recommendedUsers.length < 10) {
            const extraUsers = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: currentUserId },
                        _id: { $nin: friendsList },
                        isOnboarded: true,
                        _id: { $nin: recommendedUsers.map(u => u._id) }
                    }
                },
                { $sample: { size: 10 - recommendedUsers.length } },
                { $project: { password: 0, __v: 0 } }
            ]);

            recommendedUsers = [...recommendedUsers, ...extraUsers];
        }

        res.status(200).json( recommendedUsers );
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select('friends')
            .populate('friends', 'fullName profilePic nativeLanguage learningLanguage location');
        res.status(200).json(user.friends );
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: 'Internal server error' });
        
    }

}