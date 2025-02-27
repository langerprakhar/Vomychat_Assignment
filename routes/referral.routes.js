const express = require('express');
const referralController = require('../controllers/referral.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/referrals', authenticate, referralController.getReferrals);
router.get('/referral-stats', authenticate, referralController.getReferralStats);

module.exports = router; // Export the router directly, not as { router }
