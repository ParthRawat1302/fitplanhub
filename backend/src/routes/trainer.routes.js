const express = require("express");
const User = require("../models/User");
const Follow = require("../models/Follow");
const Plan = require("../models/Plan");
const { auth } = require("../middleware/auth");

const router = express.Router();

// List trainers
router.get("/", async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }).select(
      "name specialization bio"
    );
    res.json(trainers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Follow a trainer
router.post("/:trainerId/follow", auth, async (req, res) => {
  try {
    if (String(req.user._id) === req.params.trainerId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const trainer = await User.findOne({
      _id: req.params.trainerId,
      role: "trainer"
    });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const doc = await Follow.findOneAndUpdate(
      { follower: req.user._id, trainer: trainer._id },
      { follower: req.user._id, trainer: trainer._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Followed", follow: doc });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already following" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Unfollow trainer
router.delete("/:trainerId/follow", auth, async (req, res) => {
  try {
    await Follow.findOneAndDelete({
      follower: req.user._id,
      trainer: req.params.trainerId
    });
    res.json({ message: "Unfollowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List trainers user follows
router.get("/following", auth, async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.user._id }).populate(
      "trainer",
      "name specialization bio"
    );

    res.json(
      follows.map((f) => ({
        id: f.trainer._id,
        name: f.trainer.name,
        specialization: f.trainer.specialization,
        bio: f.trainer.bio
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Trainer profile + their plans + follow status
router.get("/:trainerId/profile", auth, async (req, res) => {
  try {
    const trainer = await User.findOne({
      _id: req.params.trainerId,
      role: "trainer"
    }).select("name specialization bio");

    if (!trainer)
      return res.status(404).json({ message: "Trainer not found" });

    const plans = await Plan.find({ trainer: trainer._id }).sort({
      createdAt: -1
    });

    const isFollowing = await Follow.exists({
      follower: req.user._id,
      trainer: trainer._id
    });

    res.json({
      trainer,
      isFollowing: !!isFollowing,
      plans
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
