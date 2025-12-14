const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active"
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }
  },
  { timestamps: true }
);

subscriptionSchema.index({ user: 1, plan: 1 }, { unique: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
