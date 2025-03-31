const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  color_code: {
    type: DataTypes.STRING(10)
  },
  description: {
    type: DataTypes.TEXT
  },
  total_days: {
    type: DataTypes.INTEGER
  },
  preparation_days: {
    type: DataTypes.INTEGER
  },
  recovery_days: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: false
});

// リレーションシップの設定はassociations.jsで一元管理するため削除
// Course.belongsTo(User);
// User.hasMany(Course);

module.exports = Course;
