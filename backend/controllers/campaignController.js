const Campaign = require("../models/Campaign");
const { escape } = require("validator");
const fs = require("fs");
const path = require("path");

exports.addCampaign = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      goalAmount,
      location,
      startDate,
      endDate,
    } = req.body;

    if (
      !title ||
      !description ||
      !goalAmount ||
      !location ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const image = req.file ? req.file.filename : null;

    const newCampaign = await Campaign.create({
      title: escape(title),
      subtitle: escape(subtitle),
      description: escape(description),
      image,
      goalAmount,
      location: escape(location),
      startDate,
      endDate,
    });

    res
      .status(201)
      .json({ message: "Campaign created", campaign: newCampaign });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating campaign", error: err.message });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching campaigns", error: err.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      goalAmount,
      location,
      startDate,
      endDate,
      status,
    } = req.body;

    // build update object
    const update = {};
    if (title) update.title = escape(title);
    if (subtitle) update.subtitle = escape(subtitle);
    if (description) update.description = escape(description);
    if (goalAmount) update.goalAmount = goalAmount;
    if (location) update.location = escape(location);
    if (startDate) update.startDate = startDate;
    if (endDate) update.endDate = endDate;
    if (status) update.status = status;

    if (req.file) {
      const campaign = await Campaign.findById(id);
      if (campaign?.image) {
        const oldPath = path.join(
          __dirname,
          "../public/campaigns/",
          campaign.image
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      update.image = req.file.filename;
    }

    const updated = await Campaign.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json({ message: "Campaign updated", campaign: updated });
  } catch (err) {
    console.error("Error updating campaign:", err);
    res
      .status(500)
      .json({ message: "Error updating campaign", error: err.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (campaign.image) {
      const imgPath = path.join(
        __dirname,
        "../public/campaigns/",
        campaign.image
      );
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    res.json({ message: "Campaign deleted" });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    res
      .status(500)
      .json({ message: "Error deleting campaign", error: err.message });
  }
};
