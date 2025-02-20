const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production' 
        ? 'https://cse341a2-movie-lesson7.onrender.com/auth/google/callback'
        : 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔹 OAuth Callback Reached');
        console.log('🔹 Google Profile Data:', profile);
        console.log('🔹 Access Token:', accessToken);

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            username: profile.displayName,
            googleId: profile.id,
            accountType: 'read',
          });

          await user.save();
          console.log('✅ New User Created:', user);
        } else {
          console.log('✅ Existing User Found:', user);
        }

        return done(null, user);
      } catch (err) {
        console.error('❌ Error in OAuth Strategy:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log('Deserializing user:', user);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
