const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

// GET all movies
// router.get('/', async (req, res) => {
//   try {
//     const movies = await Movie.find();
//     res.json(movies);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get('/', async (req, res) => {
    try {
      console.log('Fetching all movies...'); // Debug log
  
      const movies = await Movie.find();
      
      console.log('Movies retrieved:', movies); // Debug log
  
      res.json(movies);
    } catch (err) {
      console.error('Error fetching movies:', err);
      res.status(500).json({ message: err.message });
    }
  });

// GET a single movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add a new movie
router.post('/', async (req, res) => {
  try {
    const movie = new Movie({
      title: req.body.title,
      genre: req.body.genre,
      releaseYear: req.body.releaseYear,
      format: req.body.format,
      director: req.body.director,
      leadActors: req.body.leadActors,
      personalRating: req.body.personalRating,
    });

    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update a movie
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

// DELETE - Remove a movie
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
