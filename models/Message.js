const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: String,
    required: true
  },
  content: {
    text: {
      type: String,
      required: true // Text is required
    },
    images: {
      type: [String], // Array of strings to store image URLs or paths
      required: false // Images are optional
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);

