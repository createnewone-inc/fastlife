const express = require('express');
const router = express.Router();
const models = require('../models/associations');
const { Op } = require('sequelize');

// ユーザー認証確認ミドルウェア
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: '認証が必要です' });
};

// 全コース一覧の取得
router.get('/', async (req, res) => {
  try {
    const courses = await models.Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error('コース取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 特定のコースを取得
router.get('/:id', async (req, res) => {
  try {
    const course = await models.Course.findByPk(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'コースが見つかりません' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('コース取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザーのコース一覧を取得
router.get('/user/my-courses', isAuthenticated, async (req, res) => {
  try {
    const userCourses = await models.UserCourse.findAll({
      where: { user_id: req.user.id },
      include: [models.Course]
    });
    
    res.json(userCourses);
  } catch (error) {
    console.error('ユーザーコース取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザーの進行中コースを取得
router.get('/user/active', isAuthenticated, async (req, res) => {
  try {
    const activeCourse = await models.UserCourse.findOne({
      where: { 
        user_id: req.user.id,
        status: 'active'
      },
      include: [models.Course]
    });
    
    if (!activeCourse) {
      return res.status(404).json({ message: '進行中のコースがありません' });
    }
    
    res.json(activeCourse);
  } catch (error) {
    console.error('アクティブコース取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 新しいコースをユーザーに追加
router.post('/user/enroll', isAuthenticated, async (req, res) => {
  try {
    const { course_id, start_date } = req.body;
    
    if (!course_id || !start_date) {
      return res.status(400).json({ message: 'コースIDと開始日が必要です' });
    }
    
    // コースが存在するか確認
    const course = await models.Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ message: 'コースが見つかりません' });
    }
    
    // 開始日と終了日を計算
    const startDate = new Date(start_date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + course.total_days + course.preparation_days + course.recovery_days);
    
    // ユーザーコースを作成
    const userCourse = await models.UserCourse.create({
      user_id: req.user.id,
      course_id: course_id,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      current_step: 'preparation'
    });
    
    // 他の進行中コースがあれば完了状態に更新
    await models.UserCourse.update(
      { status: 'completed' },
      { 
        where: { 
          user_id: req.user.id, 
          id: { [Op.ne]: userCourse.id },
          status: 'active'
        } 
      }
    );
    
    res.status(201).json(userCourse);
  } catch (error) {
    console.error('コース登録エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザーコースの状態を更新
router.put('/user/:userCourseId', isAuthenticated, async (req, res) => {
  try {
    const { status, current_step } = req.body;
    
    // ユーザーコースが存在し、ユーザーに属しているか確認
    const userCourse = await models.UserCourse.findOne({
      where: { 
        id: req.params.userCourseId,
        user_id: req.user.id
      }
    });
    
    if (!userCourse) {
      return res.status(404).json({ message: 'コースが見つからないか、アクセス権がありません' });
    }
    
    // ユーザーコースを更新
    await userCourse.update({
      status: status || userCourse.status,
      current_step: current_step || userCourse.current_step
    });
    
    res.json(userCourse);
  } catch (error) {
    console.error('コース更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 日次ログを追加/更新
router.post('/user/:userCourseId/logs', isAuthenticated, async (req, res) => {
  try {
    const { log_date, weight, memo } = req.body;
    
    if (!log_date) {
      return res.status(400).json({ message: '日付が必要です' });
    }
    
    // ユーザーコースが存在し、ユーザーに属しているか確認
    const userCourse = await models.UserCourse.findOne({
      where: { 
        id: req.params.userCourseId,
        user_id: req.user.id
      }
    });
    
    if (!userCourse) {
      return res.status(404).json({ message: 'コースが見つからないか、アクセス権がありません' });
    }
    
    // 既存のログを確認
    let dailyLog = await models.DailyLog.findOne({
      where: {
        user_course_id: userCourse.id,
        log_date: new Date(log_date)
      }
    });
    
    // ログが存在する場合は更新、なければ作成
    if (dailyLog) {
      await dailyLog.update({
        weight: weight !== undefined ? weight : dailyLog.weight,
        memo: memo !== undefined ? memo : dailyLog.memo
      });
    } else {
      dailyLog = await models.DailyLog.create({
        user_course_id: userCourse.id,
        log_date: new Date(log_date),
        weight,
        memo
      });
    }
    
    res.status(201).json(dailyLog);
  } catch (error) {
    console.error('ログ作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザーコースのログ一覧を取得
router.get('/user/:userCourseId/logs', isAuthenticated, async (req, res) => {
  try {
    // ユーザーコースが存在し、ユーザーに属しているか確認
    const userCourse = await models.UserCourse.findOne({
      where: { 
        id: req.params.userCourseId,
        user_id: req.user.id
      }
    });
    
    if (!userCourse) {
      return res.status(404).json({ message: 'コースが見つからないか、アクセス権がありません' });
    }
    
    // ログを取得
    const logs = await models.DailyLog.findAll({
      where: { user_course_id: userCourse.id },
      order: [['log_date', 'ASC']]
    });
    
    res.json(logs);
  } catch (error) {
    console.error('ログ取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
