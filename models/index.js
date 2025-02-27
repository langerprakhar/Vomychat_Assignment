const User = require('./user.model');
const Referral = require('./referral.model');

// Associations for referrals
User.hasMany(Referral, { foreignKey: 'referrer_id', as: 'referredUsers' });
Referral.belongsTo(User, { foreignKey: 'referrer_id', as: 'referrer' });

User.hasMany(Referral, { foreignKey: 'referred_user_id', as: 'referralsReceived' });
Referral.belongsTo(User, { foreignKey: 'referred_user_id', as: 'referredUser' });

module.exports = { User, Referral };
