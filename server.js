// const express = require('express');
// const { initDb } = require('./db/connection');
// const routes = require('./routes'); // Keep this for the existing routes
// // const contactsRouter = require('./routes/contacts'); // Add this for contacts routes
// const moviesRouter = require('./routes/movies');
// const setupSwagger = require('./swagger');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware for parsing JSON
// app.use(express.json());

// setupSwagger(app);

// // Initialize the DB, then start the server
// initDb((err) => {
//   if (err) {
//     console.error('Failed to connect to MongoDB', err);
//     process.exit(1); // Exit if DB connection fails
//   } else {
//     // If connected successfully, attach routes
//     app.use('/', routes); // Existing routes
//     app.use('/api/movies', moviesRouter); // New movies API routes

//     // Start listening—this keeps Node running
//     app.listen(port, () => {
//       console.log(
//         `Web Server is listening on port ${port} http://localhost:3000/`
//       );
//     });
//   }
// });


// const express = require('express');
// const connectDB = require('./db/connection'); // ✅ Use Mongoose connection
// const moviesRouter = require('./routes/movies');
// const setupSwagger = require('./swagger');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// setupSwagger(app);

// // ✅ Connect to MongoDB first, then start the Express server
// connectDB()
//   .then(() => {
//     app.use('/api/movies', moviesRouter); // ✅ Movies API route

//     app.listen(port, () => {
//       console.log(`🚀 Web Server is running at http://localhost:${port}/`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Failed to connect to MongoDB:', err);
//     process.exit(1); // Exit the process if DB connection fails
//   });

// const express = require('express');
// const connectDB = require('./db/connection');
// const moviesRouter = require('./routes/movies');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json'); // Import Swagger JSON
// const setupSwagger = require('./swagger');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// setupSwagger(app);

// // ✅ Add Swagger UI at `/api-docs`
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// connectDB()
//   .then(() => {
//     app.use('/api/movies', moviesRouter);

//     app.listen(port, () => {
//       console.log(`🚀 Server running at http://localhost:${port}/`);
//       console.log(`📜 Swagger Docs available at http://localhost:${port}/api-docs`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Failed to connect to MongoDB:', err);
//     process.exit(1);
//   });

const express = require('express');
const connectDB = require('./db/connection');
const moviesRouter = require('./routes/movies');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // ✅ Import Swagger JSON

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ✅ Setup Swagger at `/api-docs`
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Connect to MongoDB first, then start the Express server
connectDB()
  .then(() => {
    app.use('/api/movies', moviesRouter);

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}/`);
      console.log(`📜 Swagger Docs available at http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });

