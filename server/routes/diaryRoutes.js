import express from "express";
import {
  upsertTodayDiary,
  getDiaries,
  updateDiary,
  deleteDiary,
} from "../controllers/diaryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", upsertTodayDiary);
router.get("/", getDiaries);
router.put("/:id", updateDiary);
router.delete("/:id", deleteDiary);

export default router;
