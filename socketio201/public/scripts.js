const socket = io('http://localhost:9000'); // / endpoint
const socket2 = io('http://localhost:9000/admin'); // /admin endpoint


socket.on('messageFromServer', (dataFromServer) => {
    console.log(dataFromServer);
    socket.emit('messageToServer', {data: 'Data from the client'});
});

socket.on('joined', (msg) => {
    console.log(msg);
});

socket2.on('welcome', (dataFromServer) => {
    console.log(dataFromServer);
});

document.querySelector("#message-form").addEventListener('submit', (event) => {
    event.preventDefault();
    const newMessage = document.querySelector("#user-message").value;
    console.log(newMessage);
    socket.emit('newMessageToServer', {
        text: newMessage
    });
});
