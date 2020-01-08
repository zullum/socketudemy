function joinRoom(roomName) {
    // send this roomName to the server
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        // we want to update roomname total now that we joined
        console.log(document.querySelector('.curr-room-num-users'));
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user">`;
    });
    nsSocket.on('historyCatchUp', (history) => {
        // console.log(history);
        const messagesUl = document.querySelector('#messages');
        messagesUl.innerHTML = "";
        history.forEach((msg) => {
            const newMsg = buildHTML(msg);
            const currentMessages = messagesUl.innerHTML;
            messagesUl.innerHTML = currentMessages + newMsg;
        });
        messagesUl.scrollTo(0, messagesUl.scrollHeight);
    });

    nsSocket.on('updateMembers', (numMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user">`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
    });

    let searchbox = document.querySelector('#search-box');
    searchbox.addEventListener('input', (e) => {
        console.log(e.target.value);
        let messages = document.querySelectorAll('.message-text');
        console.log(messages);
        messages.forEach((msg) => {
            if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1){
                // the message does not contyain the user search term
                msg.style.display = 'none';
            } else {
                msg.style.display = 'block';
            }
        });
    });
}