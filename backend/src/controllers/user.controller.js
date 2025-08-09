import FriendRequest from "../models/FriendRequest.js";
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


export async function sendFriednRequest(req,res){
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params;

        if (myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found." });
        }

        if( recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        const existingRequest = await FriendRequest.findOne({
            $or:[
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists." });
        }

        const newFriendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });

        res.status(201).json(newFriendRequest);
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function acceptFriednRequest(req, res) {
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(
            friendRequest.sender,
            { $addToSet: { friends: req.user.id } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { friends: friendRequest.sender } },
            { new: true } // return the updated version
        );

        res.status(200).json({ message: "Friend request accepted successfully." })

    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}


export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find(
            { recipient: req.user.id, status: "pending" }
        ).populate('sender', 'fullName profilePic nativeLanguage learningLanguage location');

        const acceptedReqs = await FriendRequest.find(
            { sender: req.user.id, status: "accepted" }
        ).populate('recipient', 'fullName profilePic');

        res.status(200).json({
            incomingReqs,
            acceptedReqs
        });

    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}


export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find(
            { sender: req.user.id, status: "pending" }
        ).populate('recipient', 'fullName profilePic nativeLanguage learningLanguage location');

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}