const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");

exports.createDonation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { campaignId, amount, token } = req.body;

    const payment = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      source: token.id,
      description: `Donation to campaign ${campaignId}`,
    });

    const donation = await Donation.create({
      userId,
      campaignId,
      amount,
      paymentStatus: payment.status,
    });

    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { raisedAmount: amount, donorCount: 1 },
    });

    res.status(200).json({ message: "Donation successful", donation });
  } catch (err) {
    console.error("Donation failed:", err);
    res.status(500).json({ message: "Donation failed", error: err.message });
  }
};
