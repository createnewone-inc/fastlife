const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100)
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  provider: {
    type: DataTypes.STRING(50)
  },
  registered_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login_at: {
    type: DataTypes.DATE
  },
  googleId: {
    type: DataTypes.STRING
  },
  picture: {
    type: DataTypes.STRING
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
}, {
  timestamps: false
});

module.exports = User;
