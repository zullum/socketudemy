// We need http because we do not use express server
const http = require('http');

// We need soctekio it's 3rd party
const socketio = require('socket.io');


// We make a http serer with node
const server = http.createServer((req, res) => {
    res.end('I am connected!');
});

const io = socketio(server);

io.on('connection', (socket, req) => {

    // ws.send becomes socket.emit
    socket.emit('welcome', 'Welcome to the websocket server!!');
    // socket.on stays the same as ws.on no change here
    socket.on('message', (msg) => {
        console.log(msg);
    });
});

server.listen(8001);