const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // ユーザーが既に存在するか確認 - Sequelize構文に修正
    let user = await User.findOne({ 
      where: { googleId: profile.id } 
    });
    
    if (user) {
      return done(null, user);
    }
    
    // 新しいユーザーを作成 - Sequelize構文に修正
    user = await User.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      displayName: profile.displayName,
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      picture: profile.photos?.[0]?.value || ''
    });
    
    done(null, user);
  } catch (error) {
    console.error('Google認証エラー:', error);
    done(error, null);
  }
}));
