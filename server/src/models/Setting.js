const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  notifications_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  auto_background: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'ja'
  }
}, {
  timestamps: false,
  tableName: 'settings'
});

module.exports = Setting; 