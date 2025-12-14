require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const planRoutes = require("./routes/plan.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const trainerRoutes = require("./routes/trainer.routes");
const feedRoutes = require("./routes/feed.routes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("FitPlanHub API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/feed", feedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
