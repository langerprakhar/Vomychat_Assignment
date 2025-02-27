const { User, Referral } = require("../models");

exports.getReferrals = async (req, res) => {
  try {
    console.log("Incoming request for referrals - User ID:", req.userId); // ✅ Debug log

    if (!req.userId) {
      console.error("❌ req.userId is undefined");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const referrals = await Referral.findAll({
      where: { referrer_id: req.userId },
      include: [
        { model: User, as: "referredUser", attributes: ["id", "username", "email"] },
      ],
    });
    console.log(referrals)
    console.log("✅ Referrals fetched successfully");
    res.json(referrals);
  } catch (error) {
    console.error("❌ Error fetching referrals:", error);
    res.status(500).json({ message: "Error fetching referrals", error: error.message });
  }
};


exports.getReferralStats = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch referral stats from DB
    const totalReferrals = await Referral.count({ where: { referrer_id: req.userId } });
    const successfulReferrals = await Referral.count({
      where: { referrer_id: req.userId, status: "successful" },
    });

    const stats = { totalReferrals, successfulReferrals };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    res.status(500).json({ message: "Error fetching referral stats", error: error.message });
  }
};
