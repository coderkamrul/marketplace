// const app = require('./app');
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5000",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation: ${conversationId}`);
  });

  socket.on('leave conversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${socket.id} left conversation: ${conversationId}`);
  });

    socket.on('send message', async (data) => {
    try {
      const { conversationId, sender, content } = data;
      
      // Save message to database through the API
      const response = await fetch(`${process.env.API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conversationId, sender, content })
      });

      if (!response.ok) {
        throw new Error('Failed to save message');
      }

      const savedMessage = await response.json();
      
      // Broadcast the message to all clients in the conversation
      io.to(conversationId).emit('new message', savedMessage);

      // Update last message in conversation
      await fetch(`${process.env.API_URL}/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lastMessage: savedMessage._id })
      });

    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('delete message', async (data) => {
    try {
      const { messageId, conversationId } = data;
  
      // Delete message from database through the API
      const response = await fetch(`${process.env.API_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
      });
  
  
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
  
      // Broadcast the message deletion to all clients in the conversation
      io.to(conversationId).emit('delete message', { messageId });
  
      // Update last message in conversation (if applicable)
      const messagesResponse = await fetch(`${process.env.API_URL}/api/messages?conversationId=${conversationId}`);

      // Update last message in conversation
      const lastMessage = messagesResponse.length > 0 ? messagesResponse[messagesResponse.length - 1]._id : null;
      await fetch(`${process.env.API_URL}/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lastMessage: lastMessage })
      });
  
    } catch (error) {
      console.error('Error handling message deletion:', error);
      socket.emit('error', { message: 'Failed to delete message' });
    }
  });

  socket.on('new notification', (data) => {
    const { userId, notificationData } = data;

    // Send the notification to the user
    io.to(`user-${userId}`).emit('new notification', notificationData);

    console.log(`Sent notification to user ${userId}:`, notificationData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

