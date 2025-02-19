const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Authenticate using Google OAuth
 *     description: Redirects to Google for authentication. Use this URL to start the login process.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication.
 *     examples:
 *       Local:
 *         value: "http://localhost:3000/auth/google"
 *       Production:
 *         value: "https://cse341a2-movie-lesson7.onrender.com/auth/google"
 */
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successful authentication.
 *       401:
 *         description: Unauthorized.
 */
// router.get('/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/'); // Redirect to homepage or dashboard
//   }
// );
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      console.log('User Authenticated:', req.user); // Debugging output
      res.redirect('/'); // ✅ Redirect to dashboard instead of looping back
    }
  );
  
  // ✅ New /dashboard route to confirm login
  router.get('/dashboard', (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ message: 'Welcome!', user: req.user });
  });  

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully.
 */
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

router.get('/check-auth', (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({ message: 'User is authenticated', user: req.user });
  });

module.exports = router;


// const express = require('express');
// const passport = require('passport');
// const router = express.Router();

// /**
//  * @openapi
//  * /auth/google:
//  *   get:
//  *     summary: Authenticate using Google OAuth
//  *     tags:
//  *       - Authentication
//  *     responses:
//  *       302:
//  *         description: Redirects to Google for authentication.
//  */
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// /**
//  * @openapi
//  * /auth/google/callback:
//  *   get:
//  *     summary: Google OAuth callback
//  *     tags:
//  *       - Authentication
//  *     responses:
//  *       200:
//  *         description: Successful authentication.
//  *       401:
//  *         description: Unauthorized.
//  */
// router.get('/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/'); // Redirect to homepage or dashboard
//   }
// );

// /**
//  * @openapi
//  * /auth/logout:
//  *   get:
//  *     summary: Logout user
//  *     tags:
//  *       - Authentication
//  *     responses:
//  *       200:
//  *         description: User logged out successfully.
//  */
// router.get('/logout', (req, res) => {
//   req.logout(() => {
//     res.redirect('/');
//   });
// });

// module.exports = router;