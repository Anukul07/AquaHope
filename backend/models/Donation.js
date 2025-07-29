const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["succeeded", "failed"],
    default: "succeeded",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
