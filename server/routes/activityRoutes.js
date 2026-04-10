import express from "express";
import {
  createActivity,
  getActivitiesByDate,
  getActivitiesRange,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * All routes are protected
 */
router.use(authMiddleware);

/**
 * ➕ Create activity
 */
router.post("/", createActivity);

/**
 * 📥 Get activities by single date
 * /api/v1/activities?date=20260410
 */
router.get("/", getActivitiesByDate);

/**
 * 📅 Get range
 * /api/v1/activities/range?start=20260401&end=20260410
 */
router.get("/range", getActivitiesRange);

/**
 * ✏️ Update activity
 */
router.put("/:id", updateActivity);

/**
 * 🗑️ Delete activity
 */
router.delete("/:id", deleteActivity);

export default router;
