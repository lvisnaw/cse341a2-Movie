const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { 
    type: String, 
    enum: ['read', 'read-write', 'admin'], 
    default: 'read' 
  } // Added accountType for user roles
});

module.exports = mongoose.model('User', userSchema);