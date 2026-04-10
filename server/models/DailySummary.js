import mongoose from "mongoose";

const dailySummarySchema = new mongoose.Schema(
  {
    u: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    dt: {
      type: Number, // YYYYMMDD
      required: true,
      index: true,
    },

    f: {
      type: Number,
      default: 0, // focused
    },

    m: {
      type: Number,
      default: 0, // maintenance
    },

    l: {
      type: Number,
      default: 0, // leisure
    },

    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
  },
);

// One summary per user per day
dailySummarySchema.index({ u: 1, dt: 1 }, { unique: true });

export const DailySummary = mongoose.model("DailySummary", dailySummarySchema);
