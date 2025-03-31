const express = require('express');
const router = express.Router();

// 認証ミドルウェア
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: '認証が必要です' });
};

// ユーザープロフィールの取得
router.get('/profile', isAuthenticated, (req, res) => {
  res.json(req.user);
});

// ユーザープロフィールの更新
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { displayName, firstName, lastName } = req.body;
    const User = require('../models/User');
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { displayName, firstName, lastName },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'プロフィールの更新に失敗しました' });
  }
});

module.exports = router;
