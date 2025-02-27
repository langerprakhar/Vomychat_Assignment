const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referral_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  referred_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users', // ✅ MATCHES your table name correctly
      key: 'id',
    },
    onDelete: 'SET NULL'
  }
  
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = User;
