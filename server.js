const express = require('express');
const connectDB = require('./db/connection');
const moviesRouter = require('./routes/movies');
const { setupSwagger } = require('./swagger');
const usersRouter = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

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
