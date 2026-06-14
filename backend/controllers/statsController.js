import dailyStatsModel from '../models/dailyStatsModel.js';

// SAVE TODAY'S STATS
const saveDailyStats = async (req, res, next) => {
  try {
    const { productivity, discipline } = req.body;
    const userId = req.body.userId || req.headers.userid;

    if (productivity === undefined || discipline === undefined) {
      return res.json({ success: false, message: 'Scores are required' });
    }

    // ✅ Normalize date (IMPORTANT for unique index)
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date();
    end.setUTCHours(23, 59, 59, 999);

    await dailyStatsModel.findOneAndUpdate(
      {
        userId,
        date: { $gte: start, $lte: end }
      },
      {
        productivity,
        discipline,
        date: start // always save normalized
      },
      {
        upsert: true,
        new: true
      }
    );
    
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);

    // await dailyStatsModel.findOneAndUpdate(
    //   { userId, date: today },
    //   {
    //     productivity,
    //     discipline
    //   },
    //   {
    //     upsert: true,
    //     new: true
    //   }
    // );


    res.json({ success: true });

  } catch (error) {
        next(error);
    }
};


// ✅ GET LAST 7 DAYS STATS
const getWeeklyStats = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.headers.userid;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats = await dailyStatsModel
      .find({ userId, date: { $gte: sevenDaysAgo } })
      .sort({ date: 1 }); // oldest → newest

    res.json({ success: true, data: stats });

  } catch (error) {
        next(error);
    }
};


export { saveDailyStats, getWeeklyStats };