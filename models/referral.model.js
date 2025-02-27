const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class Referral extends Model {}

Referral.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  referrer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  referred_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  date_referred: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'successful'),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  sequelize,
  modelName: 'Referral',
  tableName: 'Referrals',
  timestamps: true
});

module.exports = Referral;
