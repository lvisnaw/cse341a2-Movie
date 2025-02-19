require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connection');
const moviesRouter = require('./routes/movies');
const { setupSwagger } = require('./swagger');
const usersRouter = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');
const passport = require('./middleware/passport');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: false, // ✅ Change from "true" to "false"
  cookie: { secure: false } // ✅ Set to true if using HTTPS in production
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);

app.use(express.json());
setupSwagger(app);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to My Movies API! Visit /api-docs for Swagger documentation.' });
});

// Use error handler from middleware folder
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
