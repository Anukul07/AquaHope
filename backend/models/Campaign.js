const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String, required: true },
  image: { type: String },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  donorCount: { type: Number, default: 0 }, // NEW
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["active", "completed", "upcoming"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
});

campaignSchema.virtual("daysLeft").get(function () {
  const now = new Date();
  const diffTime = new Date(this.endDate) - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : 0;
});

campaignSchema.virtual("progress").get(function () {
  if (this.goalAmount === 0) return 0;
  return Math.min(
    100,
    ((this.raisedAmount / this.goalAmount) * 100).toFixed(2)
  );
});

campaignSchema.set("toObject", { virtuals: true });
campaignSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Campaign", campaignSchema);
