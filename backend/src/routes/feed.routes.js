const express = require("express");
const Follow = require("../models/Follow");
const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.user._id });
    const followedTrainerIds = follows.map((f) => f.trainer);

    const plansFromFollowed = await Plan.find({
      trainer: { $in: followedTrainerIds }
    })
      .populate("trainer", "name specialization")
      .sort({ createdAt: -1 });

    const mySubs = await Subscription.find({
      user: req.user._id,
      status: "active"
    })
      .populate({
        path: "plan",
        populate: { path: "trainer", select: "name specialization" }
      })
      .sort({ createdAt: -1 });

    res.json({
      plansFromFollowed: plansFromFollowed.map((p) => ({
        id: p._id,
        title: p.title,
        durationDays: p.durationDays,
        price: p.price,
        trainer: {
          id: p.trainer?._id,
          name: p.trainer?.name,
          specialization: p.trainer?.specialization
        }
      })),
      purchasedPlans: mySubs.map((s) => ({
        subscriptionId: s._id,
        planId: s.plan?._id,
        title: s.plan?.title,
        trainerName: s.plan?.trainer?.name
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
