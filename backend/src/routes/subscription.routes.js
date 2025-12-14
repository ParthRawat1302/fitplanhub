const express = require("express");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Simulate payment + create subscription
router.post("/:planId", auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // simulate payment (always success)
    const durationMs = plan.durationDays * 24 * 60 * 60 * 1000;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationMs);

    const sub = await Subscription.findOneAndUpdate(
      { user: req.user._id, plan: plan._id },
      {
        user: req.user._id,
        plan: plan._id,
        status: "active",
        startDate,
        endDate
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Subscription active", subscription: sub });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already subscribed" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// List user's subscriptions
router.get("/my", auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user._id, status: "active" })
      .populate({
        path: "plan",
        populate: { path: "trainer", select: "name" }
      })
      .sort({ createdAt: -1 });

    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
