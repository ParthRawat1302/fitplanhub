const express = require("express");
const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Public: list all plans (preview)
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find()
      .populate("trainer", "name specialization")
      .sort({ createdAt: -1 });

    const previews = plans.map((p) => ({
      id: p._id,
      title: p.title,
      price: p.price,
      durationDays: p.durationDays,
      trainerName: p.trainer?.name,
      trainerId: p.trainer?._id
    }));

    res.json(previews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Trainer: create plan
router.post("/", auth, requireRole("trainer"), async (req, res) => {
  try {
    const { title, description, price, durationDays } = req.body;
    const plan = await Plan.create({
      title,
      description,
      price,
      durationDays,
      trainer: req.user._id
    });
    res.status(201).json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Trainer: update plan
router.put("/:id", auth, requireRole("trainer"), async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (String(plan.trainer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your plan" });
    }

    const { title, description, price, durationDays } = req.body;
    if (title !== undefined) plan.title = title;
    if (description !== undefined) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (durationDays !== undefined) plan.durationDays = durationDays;

    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Trainer: delete plan
router.delete("/:id", auth, requireRole("trainer"), async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (String(plan.trainer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your plan" });
    }

    await plan.deleteOne();
    res.json({ message: "Plan deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Plan details: full vs preview based on subscription
router.get("/:id", auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate(
      "trainer",
      "name specialization bio"
    );
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const subscription = await Subscription.findOne({
      user: req.user._id,
      plan: plan._id,
      status: "active"
    });

    if (!subscription) {
      return res.json({
        previewOnly: true,
        plan: {
          id: plan._id,
          title: plan.title,
          price: plan.price,
          durationDays: plan.durationDays,
          trainerName: plan.trainer?.name,
          trainerId: plan.trainer?._id
        }
      });
    }

    res.json({
      previewOnly: false,
      plan
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Trainer's own plans
router.get("/trainer/me/list", auth, requireRole("trainer"), async (req, res) => {
  try {
    const plans = await Plan.find({ trainer: req.user._id }).sort({
      createdAt: -1
    });
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
