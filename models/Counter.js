const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Counter', counterSchema);
