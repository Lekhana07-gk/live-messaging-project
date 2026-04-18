const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

//change 1:Allow connections from anywhere by
//  setting origin to "*"

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});
// Change 2: Let the cloud provider choose the port, or 
// default to 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('Backend server is running on port ${PORT}');
  
});