const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // ユーザーが既に存在するか確認
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // 新しいユーザーを作成
    user = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      displayName: profile.displayName,
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      photo: profile.photos?.[0]?.value || ''
    });
    
    await user.save();
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));
