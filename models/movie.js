const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  format: { type: String, enum: ['DVD', 'Blu-ray', 'Digital'], required: true },
  director: { type: String, required: true },
  leadActors: [{ type: String }],
  personalRating: { type: Number, min: 0, max: 10 },
});

// ✅ Ensure the model is properly exported
module.exports = mongoose.model('Movie', movieSchema);
