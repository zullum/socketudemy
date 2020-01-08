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

    socket.on('newMessageToServer', ( msg ) => {
        // console.log(msg);
        io.emit('messageToClients', {
            text: msg.text
        })
    });
});