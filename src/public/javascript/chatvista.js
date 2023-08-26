const socket = io();

const submitMessage = document.getElementById("submitMessage");

submitMessage.addEventListener("click", (e) => {
  e.preventDefault();
  const nombreUser = document.getElementById("nombre");
  const messageUser = document.getElementById("message");
  socket.emit("addMessage", { user: nombreUser.value, message: messageUser.value });
  messageUser.value = "";
 
});

const messagesContainer = document.getElementById("messagesContainer");
socket.on("getMessages", (messages) => {
  messagesContainer.innerHTML = "";
  messages.map((message) => {
    messagesContainer.innerHTML += `<div class="message-bubble">
              <span class="spanChat">${message.user}: </span> 
              <p class="pChat">${message.message}</p>
          </div>`;
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});
