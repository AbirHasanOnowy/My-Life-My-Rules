import DailySummary from "../models/DailySummary.js";
import mongoose from "mongoose";

/**
 * 📅 Daily Summary
 * GET /api/v1/summary/daily?date=YYYYMMDD
 */
export const getDailySummary = async (req, res) => {
  try {
    const u = req.user.id;
    const dt = Number(req.query.date);

    const summary = await DailySummary.findOne({ u, dt });

    if (!summary) {
      return res.json({
        date: dt,
        focused: 0,
        maintenance: 0,
        leisure: 0,
        total: 0,
      });
    }

    res.json({
      date: summary.dt,
      focused: summary.f,
      maintenance: summary.m,
      leisure: summary.l,
      total: summary.total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📈 Range Summary (for charts)
 * GET /api/v1/summary/range?start=YYYYMMDD&end=YYYYMMDD
 */
export const getSummaryRange = async (req, res) => {
  try {
    const u = req.user.id;
    const start = Number(req.query.start);
    const end = Number(req.query.end);

    const data = await DailySummary.find({
      u,
      dt: { $gte: start, $lte: end },
    }).sort({ dt: 1 });

    res.json(
      data.map((d) => ({
        date: d.dt,
        focused: d.f,
        maintenance: d.m,
        leisure: d.l,
        total: d.total,
      })),
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 📊 Stats (aggregated view)
 * GET /api/v1/summary/stats?start=...&end=...
 */
export const getSummaryStats = async (req, res) => {
  try {
    const u = req.user.id;
    const start = Number(req.query.start);
    const end = Number(req.query.end);

    if (!start || !end || isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const result = await DailySummary.aggregate([
      {
        $match: {
          u: new mongoose.Types.ObjectId(u),
          dt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          focused: { $sum: { $ifNull: ["$f", 0] } },
          maintenance: { $sum: { $ifNull: ["$m", 0] } },
          leisure: { $sum: { $ifNull: ["$l", 0] } },
          total: { $sum: { $ifNull: ["$total", 0] } },
        }
      },
    ]);


    res.json(
      result[0] || {
        focused: 0,
        maintenance: 0,
        leisure: 0,
        total: 0,
      },
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
