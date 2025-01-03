const socket = io();

const joinEventButton = document.getElementById('joinEvent');
const eventIdInput = document.getElementById('eventId');
const usernameInput = document.getElementById('username');
const chatDiv = document.getElementById('chat');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');


function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function limitMessages(maxMessages = 100) {
    while (messagesDiv.children.length > maxMessages) {
        messagesDiv.removeChild(messagesDiv.firstChild);
    }
}

joinEventButton.addEventListener('click', () => {
    const eventName = eventIdInput.value;
    const username = usernameInput.value;
    
    if (!eventId || !username) {
        alert('Event ID and username are required!');
        return;
    }

    socket.emit('joinEvent', { eventName, username });

    eventIdInput.disabled = true;
    usernameInput.disabled = true;
    joinEventButton.disabled = true;
    chatDiv.style.display = 'block';
});

socket.on('userJoined', (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    scrollToBottom();
});

socket.on('userLeft', (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    scrollToBottom();
});

socket.on('message', (data) => {
    console.log('Received message:', data);
    const messageElement = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    messageElement.textContent = `[${timestamp}] ${data.username}: ${data.message}`;
    messagesDiv.appendChild(messageElement);
    limitMessages();
    scrollToBottom();
});

socket.on('previousMessages', (messages) => {
    messages.forEach(({ username, message }) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${username}: ${message}`;
        messagesDiv.appendChild(messageElement);
    });
    scrollToBottom();
});

socket.on('error', (errorMessage) => {
    alert(`Error: ${errorMessage}`);
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    const eventName = eventIdInput.value.trim();
    const username = usernameInput.value.trim();

    if (!message) return;
    console.log('Sending message:', { eventName, username, message });
    socket.emit('sendMessage', { eventName, username, message });
    messageInput.value = '';
});
