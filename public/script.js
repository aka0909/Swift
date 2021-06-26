const socket = io('/')
const videoGrid = document.getElementById('video-grid')
var myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true //BECAUSE WE DO NOT WANT TO HEAR OUR OWN VOICE
const peers = {}
// =====================================================START OF VIDEO CALLING & CHAT SECTION============================================
let myVideoStream;
const messageContainer = document.getElementById('chat-window')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream=stream;
  addVideoStream(myVideo, stream); //ADDING OUR OWN VIDEO TO THE STREAM

  myPeer.on('call', call => {                           //ANSWERING CALL FROM THE OTHER USER TRYING TO CONNECT TO US
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId,Name) => {                //SETTING UP CONNECTION WITH THE OTHER USER
    setTimeout(()=>{
        connectToNewUser(userId,stream);
    },1000);
    appendMessage(`${Name} connected`)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
  myPeer.destroy();
  window.location.href = "/";
})

myPeer.on('open', id => {
  const Name = prompt('What is your name?')
  appendMessage('You joined')
  socket.emit('join-room', ROOM_ID, id,Name)
})
//CONNECTING TO NEW USER

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

//ADDING VIDEO TO THE VIDEO-BOX DIV

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
  })

  socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
  })


// ===========================================================END OF VIDEO CALLING AND CHAT SECTIONS===========================================

//====================================================CONTROL-BUTTON FUNCTIONALITIES============================================================

//1.MuteUnmute
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }

  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone fa-lg"></i>
    `
    document.querySelector('.mute-button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash fa-lg"></i>
    `
    document.querySelector('.mute-button').innerHTML = html;
  }

// ---------------------------------------------------------------------------------------------------------------------------------------

//2.onOff Video

const onOff = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video fa-lg"></i>
    `
    document.querySelector('.video-button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash fa-lg"></i>
    `
    document.querySelector('.video-button').innerHTML = html;
  }

// ---------------------------------------------------------------------------------------------------------------------------------------
//3.Invite Button

 function getURL() {
    const c_url = window.location.href;
    copyToClipboard(c_url);
    alert("Url Copied to Clipboard.\nShare this with your Friends!\nUrl: " + c_url);
  }
  
  function copyToClipboard(text) {
    let dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

//---------------------------------------------------------------------------------------------------------------------------------------

//4.End Call

function endCall() {
    window.location.href = "/";
  }