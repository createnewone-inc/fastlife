const express = require('express');
const router = express.Router();
const models = require('../models/associations');

// ユーザー認証確認ミドルウェア
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: '認証が必要です' });
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

// ユーザー設定の取得
router.get('/settings', isAuthenticated, async (req, res) => {
  try {
    // ユーザーの設定を取得
    let settings = await models.Setting.findOne({
      where: { user_id: req.user.id }
    });
    
    // 設定が存在しない場合は作成
    if (!settings) {
      settings = await models.Setting.create({
        user_id: req.user.id,
        notifications_enabled: true,
        auto_background: true,
        language: 'ja'
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('設定取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザー設定の更新
router.put('/settings', isAuthenticated, async (req, res) => {
  try {
    const { notifications_enabled, auto_background, language } = req.body;
    
    // 設定を検索または作成
    let [settings, created] = await models.Setting.findOrCreate({
      where: { user_id: req.user.id },
      defaults: {
        notifications_enabled: true,
        auto_background: true,
        language: 'ja'
      }
    });
    
    // 設定を更新
    await settings.update({
      notifications_enabled: notifications_enabled !== undefined ? notifications_enabled : settings.notifications_enabled,
      auto_background: auto_background !== undefined ? auto_background : settings.auto_background,
      language: language || settings.language
    });
    
    res.json(settings);
  } catch (error) {
    console.error('設定更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザーの通知一覧取得
router.get('/notifications', isAuthenticated, async (req, res) => {
  try {
    const notifications = await models.Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    
    res.json(notifications);
  } catch (error) {
    console.error('通知取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 通知を既読にする
router.put('/notifications/:id/read', isAuthenticated, async (req, res) => {
  try {
    const notification = await models.Notification.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id 
      }
    });
    
    if (!notification) {
      return res.status(404).json({ message: '通知が見つかりません' });
    }
    
    await notification.update({ is_read: true });
    res.json(notification);
  } catch (error) {
    console.error('通知更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// すべての通知を既読にする
router.put('/notifications/read-all', isAuthenticated, async (req, res) => {
  try {
    await models.Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    );
    
    res.json({ message: 'すべての通知を既読にしました' });
  } catch (error) {
    console.error('通知一括更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ランダムな背景画像を取得
router.get('/background-image', async (req, res) => {
  try {
    const count = await models.BackgroundImage.count();
    
    if (count === 0) {
      return res.status(404).json({ message: '背景画像が登録されていません' });
    }
    
    // ランダムな画像を1つ取得
    const randomOffset = Math.floor(Math.random() * count);
    const image = await models.BackgroundImage.findOne({
      offset: randomOffset,
      limit: 1
    });
    
    res.json(image);
  } catch (error) {
    console.error('背景画像取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
