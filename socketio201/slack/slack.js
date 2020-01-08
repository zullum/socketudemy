const express = require('express');

const app = express();

const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);
const io = socketio(expressServer);

let namespaces = require('./data/namespaces');


io.on('connection', ( socket ) => {
    // console.log(socket.handshake);
    // build an array to send back with an image and endpoint for each NS
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    });
    // console.log(nsData);
    // send the nsData back to the client. we want to use socket NOT the io because we want it 
    // to go just this client
    
    socket.emit('nsList', nsData);

});

// loop through each namespace and listen for connection 
namespaces.forEach((namespace) => {
    // console.log(namespace);
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        const username = nsSocket.handshake.query.username;
        // console.log(`${nsSocket.id} has joined on ${namespace.endpoint}`);
        // a socket has connexted to one of our chatroom namespaces
        // send that ns group info back

        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
            // deal with history later ...
            console.log(nsSocket.rooms);
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            updateUsersInRoom(namespace, roomToLeave);
            nsSocket.join(roomToJoin);
            // io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
            //     console.log(clients);
            //     numberOfUsersCallback(clients.length);
            // });
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomToJoin;
            });
            nsSocket.emit('historyCatchUp', nsRoom.history);

            updateUsersInRoom(namespace, roomToJoin);

        });

        nsSocket.on('newMessageToServer', (msg) => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: 'https://via.placeholder.com/30'
            }
            // console.log(fullMsg);
            // send this message to all the sockets in the room that this socket is in
            // how  can we found out WHAT room this socket is in
            // console.log(nsSocket.rooms);
            // the user will e in the 2nd room on the list
            // this is because the user always joins his own room on connection
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            // we need to find the Room object for this room
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle;
            });
            // console.log('the room object that we made that matches this namespace is ...');
            // console.log(nsRoom);
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
        });

    });
});

function updateUsersInRoom(namespace, roomToJoin){
    // send back the number of users in this room to ALL sockets connected to this room
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        // console.log(`there are ${clients.length} in this room`);
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
    });
}