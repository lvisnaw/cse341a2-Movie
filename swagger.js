const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Movies API',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Movie: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Movie Title' },
            genre: { type: 'string', example: 'Genre' },
            releaseYear: { type: 'integer', example: 2025 },
            format: { 
              type: 'string', 
              enum: ['Blu-ray', 'DVD', 'Streaming', 'Digital Download'], 
              example: 'Streaming' 
            },
            director: { type: 'string', example: 'Director Name' },
            leadActors: {
              type: 'array',
              items: { type: 'string' },
              example: ['Actor One', 'Actor Two'],
            },
            personalRating: { type: 'integer', example: 5 },
          },
        },
      },
    },
  },
  apis: ['./routes/movies.js', './routes/users.js'], // ✅ Now scans both routes
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📜 Swagger Docs available at /api-docs');
};

module.exports = { setupSwagger };
