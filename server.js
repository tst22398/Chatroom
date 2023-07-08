const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const PORT = 8080;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnect');
    });

    socket.on('newuser', (username) => {
        socket.broadcast.emit('newuser', username);
    });

    socket.on('new-message', (message) => {
        socket.broadcast.emit('new-message', message);
    });

    socket.on('leftuser', (username) => {
        socket.broadcast.emit('leftuser', username);
    });
});

httpServer.listen(PORT, () => console.log('Server is running on port ' + PORT));