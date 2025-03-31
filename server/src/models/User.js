const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  googleId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  displayName: String,
  firstName: String,
  lastName: String,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  courses: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: []
  },
  activeCourse: {
    type: DataTypes.INTEGER,
    defaultValue: null
  }
});

module.exports = User;
