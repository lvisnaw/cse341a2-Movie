const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        scope: ['profile', 'email'], // Keep only 'profile' and 'email' (Remove 'openid')
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google Profile:', profile); // Add this to see what Google returns
  
          let user = await User.findOne({ googleId: profile.id });
  
          if (!user) {
            user = new User({
              username: profile.displayName,
              googleId: profile.id,
              accountType: 'read', // Default role
            });
  
            await user.save();
            console.log('New User Created:', user); // Log user after saving
          }
  
          return done(null, user);
        } catch (err) {
          console.error('Error saving user:', err);
          return done(err, null);
        }
      }
    )
  );  

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id); // Stores only the user ID in the session
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
