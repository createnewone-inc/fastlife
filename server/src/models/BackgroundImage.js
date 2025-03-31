const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const BackgroundImage = sequelize.define('BackgroundImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.TEXT
  },
  keyword: {
    type: DataTypes.STRING(50)
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'background_images'
});

module.exports = BackgroundImage; 