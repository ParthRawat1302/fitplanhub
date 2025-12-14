const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

followSchema.index({ follower: 1, trainer: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followSchema);
