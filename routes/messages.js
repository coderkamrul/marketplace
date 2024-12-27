const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a conversation
router.get('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .sort('timestamp')
      .limit(100); // Limit to prevent excessive data
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { conversationId, sender, content } = req.body;

    // Validate content structure
    if (!content?.text) {
      return res.status(400).json({ error: 'Text is required in the content field' });
    }

    const message = new Message({
      conversationId,
      sender,
      content: {
        text: content.text,
        images: content.images || [] // Default to an empty array if no images are provided
      }
    });

    const savedMessage = await message.save();
    
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Delete a message
router.delete('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});


// Get the last message for a conversation
router.get('/:conversationId/last', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const lastMessage = await Message.findOne({ conversationId })
      .sort('-createdAt')
      .populate('sender', 'name email picture');

    if (!lastMessage) {
      return res.status(404).json({ error: 'No messages found for this conversation' });
    }

    res.json(lastMessage);
  } catch (error) {
    console.error('Error fetching last message:', error);
    res.status(500).json({ error: 'Failed to fetch last message' });
  }
});

module.exports = router;



