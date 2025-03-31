const User = require('./User');
const Course = require('./Course');
const UserCourse = require('./UserCourse');
const DailyLog = require('./DailyLog');
const Notification = require('./Notification');
const Setting = require('./Setting');
const BackgroundImage = require('./BackgroundImage');

// User と UserCourse の関連
User.hasMany(UserCourse, { foreignKey: 'user_id' });
UserCourse.belongsTo(User, { foreignKey: 'user_id' });

// Course と UserCourse の関連
Course.hasMany(UserCourse, { foreignKey: 'course_id' });
UserCourse.belongsTo(Course, { foreignKey: 'course_id' });

// UserCourse と DailyLog の関連
UserCourse.hasMany(DailyLog, { foreignKey: 'user_course_id' });
DailyLog.belongsTo(UserCourse, { foreignKey: 'user_course_id' });

// User と Notification の関連
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// User と Setting の関連
User.hasOne(Setting, { foreignKey: 'user_id' });
Setting.belongsTo(User, { foreignKey: 'user_id' });

// 既存のリレーションシップを修正（Course.js内のリレーションシップと競合しないように）
// Course.belongsTo(User)とUser.hasMany(Course)を削除または修正する必要があります

module.exports = {
  User,
  Course,
  UserCourse,
  DailyLog,
  Notification,
  Setting,
  BackgroundImage
}; 