const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google認証開始
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google認証コールバック
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: process.env.CLIENT_URL || 'http://localhost:5173'
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  }
);

// ログアウト
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  });
});

// 現在のユーザー情報を返す
router.get('/current-user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: '認証されていません' });
  }
});

module.exports = router;
