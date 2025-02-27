const crypto = require('crypto');

const generateReferralCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let referralCode = '';
  while (referralCode.length < length) {
    const randomByte = crypto.randomBytes(1)[0];
    referralCode += chars[randomByte % chars.length];
  }
  return referralCode;
};

module.exports = { generateReferralCode };
