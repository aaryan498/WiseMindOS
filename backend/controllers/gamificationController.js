import userModel from '../models/userModel.js';

// Calculate level based on XP (e.g. 100 XP per level)
const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
};

// Add XP to user and update level
const awardXP = async (userId, xpAmount) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) return null;

        user.xp = (user.xp || 0) + xpAmount;
        user.level = calculateLevel(user.xp);
        
        await user.save();
        return user;
    } catch (error) {
        console.error("Error awarding XP:", error);
        throw error;
    }
};

// Get the top 50 users for the leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await userModel.find({}, 'name username profile_picture xp level')
            .sort({ xp: -1 })
            .limit(50);
            
        res.json({ success: true, leaderboard });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.json({ success: false, message: error.message });
    }
};

export { awardXP, getLeaderboard };
