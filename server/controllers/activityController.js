import Activity from "../models/Activity.js";
import DailySummary from "../models/DailySummary.js";

/**
 * Category mapping
 */
const CATEGORY_MAP = {
  focused: 0,
  maintenance: 1,
  leisure: 2,
};

const REVERSE_CATEGORY = {
  0: "focused",
  1: "maintenance",
  2: "leisure",
};

/**
 * Helper: update daily summary
 */
const updateSummary = async (u, dt, category, duration, mode = "inc") => {
  const incValue = mode === "inc" ? duration : -duration;

  const inc = {
    total: incValue,
  };

  if (category === 0) inc.f = incValue;
  if (category === 1) inc.m = incValue;
  if (category === 2) inc.l = incValue;

  await DailySummary.updateOne(
    { u, dt },
    {
      $inc: inc,
      $setOnInsert: { u, dt },
    },
    { upsert: true },
  );
};

/**
 * ➕ Create Activity
 * POST /api/v1/activities
 */
export const createActivity = async (req, res) => {
  try {
    const u = req.user.id;
    const { title, category, duration, date } = req.body;

    const c = CATEGORY_MAP[category];
    if (c === undefined) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const activity = await Activity.create({
      u,
      t: title,
      c,
      d: duration,
      dt: date,
    });

    await updateSummary(u, date, c, duration, "inc");

    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📥 Get Activities by Date
 * GET /api/v1/activities?date=YYYYMMDD
 */
export const getActivitiesByDate = async (req, res) => {
  try {
    const u = req.user.id;
    const dt = Number(req.query.date);

    const activities = await Activity.find({ u, dt }).sort({ createdAt: -1 });

    res.json(
      activities.map((a) => ({
        id: a._id,
        title: a.t,
        category: a.c,
        duration: a.d,
        date: a.dt,
      })),
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📅 Range Query
 * GET /api/v1/activities/range?start=YYYYMMDD&end=YYYYMMDD
 */
export const getActivitiesRange = async (req, res) => {
  try {
    const u = req.user.id;
    const start = Number(req.query.start);
    const end = Number(req.query.end);

    const activities = await Activity.find({
      u,
      dt: { $gte: start, $lte: end },
    }).sort({ dt: 1 });

    res.json(
      activities.map((a) => ({
        id: a._id,
        title: a.t,
        category: a.c,
        duration: a.d,
        date: a.dt,
      })),
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✏️ Update Activity
 * PUT /api/v1/activities/:id
 */
export const updateActivity = async (req, res) => {
  try {
    const u = req.user.id;
    const { id } = req.params;
    const { title, category, duration } = req.body;

    const activity = await Activity.findOne({ _id: id, u });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const oldCategory = activity.c;
    const oldDuration = activity.d;
    const dt = activity.dt;

    // reverse old summary
    await updateSummary(u, dt, oldCategory, oldDuration, "dec");

    const newCategory =
      CATEGORY_MAP[category] !== undefined
        ? CATEGORY_MAP[category]
        : oldCategory;

    activity.t = title ?? activity.t;
    activity.c = newCategory;
    activity.d = duration ?? activity.d;

    await activity.save();

    // apply new summary
    await updateSummary(u, dt, activity.c, activity.d, "inc");

    res.json({
      id: activity._id,
      title: activity.t,
      category: activity.c,
      duration: activity.d,
      date: activity.dt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🗑️ Delete Activity
 * DELETE /api/v1/activities/:id
 */
export const deleteActivity = async (req, res) => {
  try {
    const u = req.user.id;
    const { id } = req.params;

    const activity = await Activity.findOne({ _id: id, u });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await updateSummary(u, activity.dt, activity.c, activity.d, "dec");

    await activity.deleteOne();

    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
