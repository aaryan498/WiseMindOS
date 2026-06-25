import dailyStatsModel from '../models/dailyStatsModel.js';

// SAVE TODAY'S STATS
const saveDailyStats = async (req, res, next) => {
  try {
    const { productivity, discipline } = req.body;
    const userId = req.user.id;

    if (productivity === undefined || discipline === undefined) {
      return res.json({ success: false, message: 'Scores are required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await dailyStatsModel.findOneAndUpdate(
      { userId, date: today },
      {
        productivity,
        discipline
      },
      {
        upsert: true,
        new: true
      }
    );


    res.json({ success: true });

  } catch (error) {
        next(error);
    }
};


// ✅ GET LAST 7 DAYS STATS
const getWeeklyStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const stats = await dailyStatsModel
      .find({ userId, date: { $gte: lastWeek } })
      .sort({ date: 1 });

    res.json({ success: true, data: stats });

  } catch (error) {
        next(error);
    }
};


export { saveDailyStats, getWeeklyStats };