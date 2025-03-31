const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Course = sequelize.define('Course', {
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// リレーションシップの設定
Course.belongsTo(User);
User.hasMany(Course);

module.exports = Course;
