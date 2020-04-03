const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const usersList = document.getElementById('users');

//  get username and room from url
let params = new URL(document.location).searchParams;
let username = params.get('username');
let room = params.get('room');

const socket = io();

//  join chatroom
socket.emit('joinRoom', { username, room });

//  get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//  message sent from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  //  scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //  grab message from form input
  const msg = e.target.elements.msg.value;

  //  emit message to server
  socket.emit('chatMessage', msg);

  //  clear form input
  chatForm.reset();
  chatForm.msg.focus();
});

//  output message to DOM
const outputMessage = (msg) => {
  chatMessages.insertAdjacentHTML(
    'beforeend',
    `<div class="message">
 <p class="meta">${msg.username} <span>${msg.time}</span></p>
 <p class="text">
   ${msg.text}
 </p>
 </div>`
  );
};

//  add room name to DOM
function outputRoomName(room) {
  document.getElementById('room-name').innerText = room;
}

//  add users to DOM
function outputUsers(users) {
  usersList.innerHTML = users
    .map((user) => `<li>${user.username}</li>`)
    .join('');
}
