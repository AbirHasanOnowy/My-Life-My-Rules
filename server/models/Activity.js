import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    u: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    t: {
      type: String,
      required: true,
      trim: true,
    },

    c: {
      type: Number,
      required: true,
      enum: [0, 1, 2], // focused, maintenance, leisure
      index: true,
    },

    d: {
      type: Number,
      required: true, // duration in minutes
      min: 1,
    },

    dt: {
      type: Number, // YYYYMMDD
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Compound Indexes (important for your queries)
activitySchema.index({ u: 1, dt: 1 });
activitySchema.index({ u: 1, c: 1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;