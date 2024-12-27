const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: {
    text: String,
    images: [String],  // Array of image URLs
  },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;


