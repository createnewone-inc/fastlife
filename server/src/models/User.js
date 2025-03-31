const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  firstName: String,
  lastName: String,
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  activeCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
});

module.exports = mongoose.model('User', userSchema);
