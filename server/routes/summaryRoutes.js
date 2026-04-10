import express from "express";
import {
  getDailySummary,
  getSummaryRange,
  getSummaryStats,
} from "../controllers/summary.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Protect all summary routes
 */
router.use(authMiddleware);

/**
 * 📅 Daily summary
 * /api/v1/summary/daily?date=20260410
 */
router.get("/daily", getDailySummary);

/**
 * 📈 Range summary (charts)
 * /api/v1/summary/range?start=20260401&end=20260410
 */
router.get("/range", getSummaryRange);

/**
 * 📊 Aggregated stats
 * /api/v1/summary/stats?start=20260401&end=20260410
 */
router.get("/stats", getSummaryStats);

export default router;
