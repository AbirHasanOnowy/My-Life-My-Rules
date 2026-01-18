import Diary from "../models/Diary.js";

export const getDiaries = async (req, res) => {
  const diaries = await Diary.find({ user: req.user._id }).sort({ date: -1 });

  res.json(diaries);
};

export const upsertTodayDiary = async (req, res) => {
  const { content } = req.body;
  const today = new Date().toISOString().split("T")[0];

  const diary = await Diary.findOneAndUpdate(
    { user: req.user._id, date: today },
    { content },
    { new: true, upsert: true },
  );

  res.status(200).json(diary);
};

export const updateDiary = async (req, res) => {
  const diary = await Diary.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { content: req.body.content },
    { new: true },
  );

  if (!diary) {
    return res.status(404).json({ message: "Diary not found" });
  }

  res.json(diary);
};

export const deleteDiary = async (req, res) => {
  const diary = await Diary.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!diary) {
    return res.status(404).json({ message: "Diary not found" });
  }

  res.json({ message: "Diary deleted" });
};
