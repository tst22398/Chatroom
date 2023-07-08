(function() {
    const app = document.querySelector('.app');
    const messageContainter = app.querySelector('.message-container');
    const socket = io();

    let uname;

    app.querySelector('.join-screen #enter').addEventListener('click', () => {
        let username = app.querySelector('.join-screen #username').value;
        
        socket.emit('newuser', username);
        uname = username;
        app.querySelector('.join-screen').classList.remove('active');
        app.querySelector('.chat-screen').classList.add('active');
    });

    app.querySelector('.chat-screen #send-message').addEventListener('click', () => {
        let message = {
            what: app.querySelector('.chat-screen #message-input').value,
            by: uname
        };

        renderNewMessage(message.what, 'send', message.by);

        app.querySelector('.chat-screen #message-input').value = ''; 
        
        socket.emit('new-message', message);
    });

    app.querySelector('.chat-screen #exit-btn').addEventListener('click', () => {
        app.querySelector('.join-screen').classList.add('active');
        app.querySelector('.chat-screen').classList.remove('active');

        messageContainter.innerHTML = '';

        socket.emit('leftuser', uname);
    });

    socket.on('newuser', (username) => {
        renderNewMessage(username + ' has entered the conservation!', 'announce', 'server');
    });

    socket.on('disconnect', () => {
        renderNewMessage('One user has disconnect the conservation!', 'announce', 'server');
    });

    socket.on('new-message', (message) => {
        renderNewMessage(message.what, 'receive', message.by);
    });

    socket.on('leftuser', (username) => {
        renderNewMessage(username + ' has left the conservation!', 'announce', 'server');
    });

    function renderNewMessage(actionMessage, actionType, actionBy) {
        let containElement;

        switch (actionType) {
            case 'announce': 
                containElement = 
                `<div class="update">
                    ${actionMessage}
                </div>`
            break;
            case 'send': 
                containElement = 
                `<div class="message my-message">
                    <div class="name">${actionBy}</div>
                    <div class="msg">${actionMessage}</div>
                </div>`;
            break;
            case 'receive':
                containElement = 
                `<div class="message other-message">
                    <div class="name">${actionBy}</div>
                    <div class="msg">${actionMessage}</div>
                </div>`;
            break;
        }

        messageContainter.innerHTML += containElement;
        messageContainter.scrollTop = messageContainter.scrollHeight;
    }
})();