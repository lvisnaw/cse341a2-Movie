const express = require('express');
const connectDB = require('./db/connection');
const moviesRouter = require('./routes/movies'); // ✅ Movies API Route
const { setupSwagger } = require('./swagger'); // ✅ Import Swagger setup
const usersRouter = require('./routes/users'); // ✅ Import Users API
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ✅ Setup Swagger Docs
setupSwagger(app);

// ✅ Users API Route
app.use('/api/users', usersRouter); // ✅ Register Users API

// ✅ Ensure `/api/movies` is correctly set BEFORE the home route
app.use('/api/movies', moviesRouter);

// ✅ Home Route (This should be LAST to prevent overriding other routes)
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to My Movies API! Visit /api-docs for Swagger documentation.' });
});

// ✅ Connect to MongoDB first, then start the Express server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
