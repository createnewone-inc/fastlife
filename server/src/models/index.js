const { Sequelize } = require('sequelize');

// HerokuのDATABASE_URL環境変数を使用
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // セキュリティの問題があるため本番環境では推奨されません
    }
  }
});

module.exports = sequelize;
