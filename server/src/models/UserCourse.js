const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const UserCourse = sequelize.define('UserCourse', {
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
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Courses',
      key: 'id'
    }
  },
  start_date: {
    type: DataTypes.DATEONLY
  },
  status: {
    type: DataTypes.STRING(50)
  },
  current_step: {
    type: DataTypes.STRING(50)
  },
  end_date: {
    type: DataTypes.DATEONLY
  }
}, {
  timestamps: false,
  tableName: 'user_courses'
});

module.exports = UserCourse;
