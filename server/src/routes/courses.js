const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');

// 認証ミドルウェア
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: '認証が必要です' });
};

// ユーザーのすべてのコースを取得
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('courses');
    res.json(user.courses);
  } catch (error) {
    res.status(500).json({ error: 'コースの取得に失敗しました' });
  }
});

// 新しいコースを作成
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, description, fastingHours, eatingHours, isPublic } = req.body;
    
    const course = new Course({
      name,
      description,
      fastingHours,
      eatingHours,
      isPublic,
      createdBy: req.user._id
    });
    
    const savedCourse = await course.save();
    
    // ユーザーのコースリストに追加
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { courses: savedCourse._id } }
    );
    
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ error: 'コースの作成に失敗しました' });
  }
});

// アクティブなコースを設定
router.put('/active/:courseId', isAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { activeCourse: courseId },
      { new: true }
    ).populate('activeCourse');
    
    res.json(user.activeCourse);
  } catch (error) {
    res.status(500).json({ error: 'アクティブコースの設定に失敗しました' });
  }
});

// コースを削除
router.delete('/:courseId', isAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // コースの所有者を確認
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'コースが見つかりません' });
    }
    
    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'このコースを削除する権限がありません' });
    }
    
    await Course.findByIdAndDelete(courseId);
    
    // ユーザーのコースリストから削除
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { courses: courseId } }
    );
    
    // アクティブコースだった場合はnullに設定
    if (req.user.activeCourse && req.user.activeCourse.toString() === courseId) {
      await User.findByIdAndUpdate(
        req.user._id,
        { activeCourse: null }
      );
    }
    
    res.json({ message: 'コースが削除されました' });
  } catch (error) {
    res.status(500).json({ error: 'コースの削除に失敗しました' });
  }
});

module.exports = router;
