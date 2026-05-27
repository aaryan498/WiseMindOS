import dailyStatsModel from '../models/dailyStatsModel.js';

const WEEKLY_STATS_DAYS = 7;

const getUtcDayStart = (date = new Date()) => {
  const dayStart = new Date(date);
  dayStart.setUTCHours(0, 0, 0, 0);
  return dayStart;
};

const getWeeklyWindowStart = (date = new Date()) => {
  const windowStart = getUtcDayStart(date);
  windowStart.setUTCDate(windowStart.getUTCDate() - (WEEKLY_STATS_DAYS - 1));
  return windowStart;
};

// SAVE TODAY'S STATS
const saveDailyStats = async (req, res) => {
  try {
    const { productivity, discipline } = req.body;
    const userId = req.body.userId || req.headers.userid;

    if (productivity === undefined || discipline === undefined) {
      return res.json({ success: false, message: 'Scores are required' });
    }

    const today = getUtcDayStart();

    await dailyStatsModel.findOneAndUpdate(
      {
        userId,
        date: today
      },
      {
        productivity,
        discipline,
        date: today
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// ✅ GET LAST 7 DAYS STATS
const getWeeklyStats = async (req, res) => {
  try {
    const userId = req.body.userId || req.headers.userid;
    const windowStart = getWeeklyWindowStart();

    const stats = await dailyStatsModel
      .find({
        userId,
        date: { $gte: windowStart }
      })
      .sort({ date: 1 })
      .select('date productivity discipline')
      .lean();

    res.json({ success: true, data: stats });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export { saveDailyStats, getWeeklyStats };
