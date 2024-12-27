const express = require('express');
const router = express.Router();
const Conversation = require('../models/Converssation');
const Message = require('../models/Message');
const io = require('../server');

// Get conversations for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email picture')
      .populate('lastMessage')
      .sort('-updatedAt')

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get a specific conversation
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name email picture')
      .populate('lastMessage');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});



// Create a new conversation
router.post('/', async (req, res) => {
  try {
    const { userId, recipientId } = req.body;

    if (!userId || !recipientId) {
      return res.status(400).json({ error: 'Both userId and recipientId are required' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, recipientId]
      });
    }

    await conversation.populate('participants', 'name email picture');

    // Emit event for new conversation
    // io.emit('new conversation', conversation);	

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Delete a conversation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConversation = await Conversation.findByIdAndDelete(id);

    if (!deletedConversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Delete all messages associated with this conversation
    await Message.deleteMany({ conversationId: id });

    // Emit event for deleted conversation
    io.emit('conversation deleted', id);

    res.json({ message: 'Conversation and associated messages deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

module.exports = router;
