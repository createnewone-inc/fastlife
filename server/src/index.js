require('dotenv').config();
const express = require('express');
const cors = require('cors');
// mongooseは使わないのでコメントアウト
// const mongoose = require('mongoose');
const session = require('express-session');
// MongoStoreはPostgreSQLに切り替えるのでコメントアウト
// const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
// sequelizeのインポートを修正
const sequelize = require('./models/index');
// モデルをインポート
const User = require('./models/User');
const Course = require('./models/Course');
// モデル間の関連付けをインポート
const models = require('./models/associations');

// パスポート設定のインポート
require('./config/passport');

// ルートのインポート
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const courseRoutes = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 8000;

// ミドルウェア
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// セッション設定 - PostgreSQLに切り替え
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14日間
    secure: process.env.NODE_ENV === 'production'
  }
}));

// パスポート初期化
app.use(passport.initialize());
app.use(passport.session());

// APIルート
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/courses', courseRoutes);

// 本番環境ではクライアントビルドファイルを提供
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

// PostgreSQL接続と同期
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL接続成功');
    // モデルをデータベースと同期
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('モデル同期完了');
    // 初期データの投入（必要に応じて）
    return initializeData();
  })
  .catch(err => {
    console.error('データベース接続エラー:', err);
  });

// 初期データ作成関数
async function initializeData() {
  try {
    // コースの初期データを作成
    const coursesCount = await models.Course.count();
    if (coursesCount === 0) {
      await models.Course.bulkCreate([
        {
          name: '16時間ファスティング',
          color_code: '#4CAF50',
          description: '毎日16時間の断食を行うプログラム',
          total_days: 7,
          preparation_days: 1,
          recovery_days: 1
        },
        {
          name: '24時間ファスティング',
          color_code: '#2196F3',
          description: '24時間の完全断食を行うプログラム',
          total_days: 1,
          preparation_days: 1,
          recovery_days: 1
        },
        {
          name: '3日間ファスティング',
          color_code: '#9C27B0',
          description: '3日間の断食チャレンジ',
          total_days: 3,
          preparation_days: 2,
          recovery_days: 2
        }
      ]);
      console.log('初期コースデータが作成されました');
    }

    // 既存ユーザーの設定を確認・作成
    const users = await models.User.findAll();
    for (const user of users) {
      // 各ユーザーに対して設定が存在するか確認
      const settingExists = await models.Setting.findOne({
        where: { user_id: user.id }
      });
      
      // 設定が存在しない場合は作成
      if (!settingExists) {
        await models.Setting.create({
          user_id: user.id,
          notifications_enabled: true,
          auto_background: true,
          language: 'ja'
        });
        console.log(`ユーザーID ${user.id} の設定を作成しました`);
      }
    }
  } catch (error) {
    console.error('初期データ作成エラー:', error);
  }
}

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
