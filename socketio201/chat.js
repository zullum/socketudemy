const express = require('express');

const app = express();

const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);

const io = socketio(expressServer);

io.on('connection', ( socket ) => {
    socket.emit('messageFromServer', {
        data: 'Welcome to the socket io server'
    });
    socket.on('messageToServer', ( messageFromClient ) => {
        console.log(messageFromClient);
    });

    socket.join('level1');
    io.of('/').to('level1').emit('joined', `${socket.id} says: I have joind level1 room!!!`);
});


// on connect and on connection are aliases they are the same
io.of('/admin').on('connect', (socket) => {
    console.log('someone connected to aadmin namespace');
    io.of('/admin').emit('welcome', 'Welcome to the admin chanell');
});