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
        // io.of('/').emit...
        io.emit('messageToClients', {
            text: msg.text
        });
    });

    // The server can still communicate accross multiple namespaces
    // but on the client, the socket needs to be in that namespaces
    // in order to get the events 

    setTimeout(() => {
        io.of('/admin').emit('welcome', 'Welcome to the admin chanell from main chanell');
    }, 2000);
    
    

});


// on connect and on connection are aliases they are the same
io.of('/admin').on('connect', (socket) => {
    console.log('someone connected to aadmin namespace');
    io.of('/admin').emit('welcome', 'Welcome to the admin chanell');
});