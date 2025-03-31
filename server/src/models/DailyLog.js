const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const DailyLog = sequelize.define('DailyLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'UserCourses',
      key: 'id'
    }
  },
  log_date: {
    type: DataTypes.DATEONLY
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2)
  },
  memo: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: false,
  tableName: 'daily_logs'
});

module.exports = DailyLog;
