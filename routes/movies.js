const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

/**
 * @openapi
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieves a list of all movies.
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: Successfully retrieved movies.
 */
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @openapi
 * /api/movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieves a movie by its unique ID.
 *     tags:
 *       - Movies
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Successfully retrieved movie.
 *       404:
 *         description: Movie not found.
 */
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @openapi
 * /api/movies:
 *   post:
 *     summary: Add a new movie
 *     description: Adds a new movie to the database.
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie added successfully.
 */
router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @openapi
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie
 *     description: Updates an existing movie.
 *     tags:
 *       - Movies
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully.
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @openapi
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Deletes a movie by ID.
 *     tags:
 *       - Movies
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
