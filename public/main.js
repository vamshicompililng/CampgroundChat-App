const socket = io();  // The io() function is used to create the socket connection.

const clientsTotal=document.getElementById('client-total');
const messageContainer=document.getElementById('message-container');
const nameInputIs=document.getElementById('name-input');
const messageForm=document.getElementById('message-form');
const messageInput=document.getElementById('message-input');


const messageTone=new Audio('/message-tone.mp3');

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    sendMessage();
})
socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total clients: ${data}`; 
});


 
function sendMessage(){
    if(messageInput.value===""){
        alert('Please enter a message');
        return;
    }
    // console.log(messageInput.value);;
    const data={
        name:nameInputIs.value,
        message:messageInput.value,
        dateTime:new Date()

    }
    socket.emit('message',data);
    addMessageToUI(true,data); // The addMessageToUI() function is used to add the message to the UI. from the user side to some other user.
    messageInput.value="";
    
    scrollToBottom();


}

socket.on('chat-message',(data)=>{  
    messageTone.play();
    // console.log(data);
    addMessageToUI(false,data); // The addMessageToUI() function is used to add the message to the UI. from some other user to the user side.
})

function addMessageToUI(isOwnMessage,data){
   const element=` 
   <li class="${isOwnMessage?"message-right":"message-left"}">
            <p class="message">
                ${data.message}
                <span> ${data.name} ⚪️ ${moment(data.dateTime).fromNow()}</span> 
            </p>
     </li>`


     messageContainer.innerHTML+=element;
     scrollToBottom();
}

function scrollToBottom(){
    messageContainer.scrollTop(0, messageContainer.scrollHeight);
}

// messageInput.addEventListener('focus',(e)=>{
//   socket.emit('feed',{
//     feed:` ✍🏻 ${nameInputIs.value} is typing a message`
//   })
// })
// messageInput.addEventListener('keypress',(e)=>{
//     socket.emit('feed',{
//         feed:` ✍🏻 ${nameInputIs.value} is typing a message`
//       })
// })
// messageInput.addEventListener('blur',(e)=>{
//     socket.emit('feed',{
//         feed:""
//       })
// })

// socket.on('feed',(data)=>{  
//     const element=`
//     <li class="message-feedback">
//             <p class="feedback" id="feedback">
//                  ${data.feed}
//             </p>
//     </li>`

//     messageContainer.innerHTML+=element;
// });
let isTyping = false; // Flag to track typing status

messageInput.addEventListener('focus', () => {
    if (!isTyping) {
        isTyping = true; // Set typing status
        socket.emit('feed', {
            feed: `✍🏻 ${nameInputIs.value} is typing a message`
        });
    }
});

messageInput.addEventListener('keypress', () => {
    if (!isTyping) {
        isTyping = true; // Set typing status
        socket.emit('feed', {
            feed: `✍🏻 ${nameInputIs.value} is typing a message`
        });
    }
});

// Reset typing status when input loses focus
messageInput.addEventListener('blur', () => {
    isTyping = false; // Reset typing status
    socket.emit('feed', {
        feed: "" // Clear the feedback
    });
});

socket.on('feed', (data) => {
    // Remove any existing feedback to avoid duplicates
    const existingFeedback = document.querySelector('.message-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    if (data.feed) {
        const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback">
                ${data.feed}
            </p>
        </li>`;

        messageContainer.innerHTML += element;
    }
});