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
  })
  .catch(err => {
    console.error('データベース接続エラー:', err);
  });

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
