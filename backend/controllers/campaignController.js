const Campaign = require("../models/Campaign");
const { escape } = require("validator");

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
