const io = require('socket.io')(server);
const Chat = require('./models/Chat'); // Assuming you've defined Chat model

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('send Chat', async (data) => {
    const { conversationId, sender, content } = data;

    // Save the Chat to DB
    const chat = new Chat({ conversationId, sender, content });
    await chat.save();

    // Emit Chat to the room
    io.to(conversationId).emit('new Chat', Chat);
  });

  socket.on('leave conversation', (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
