const socket = io('/')
const videoGrid = document.getElementById('video-grid')
var myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true //BECAUSE WE DO NOT WANT TO HEAR OUR OWN VOICE
// myVideo.setAttribute("controls","true")
let currentPeer;
const peers = {}
let peersList=[]
let userstreams=[]
// =====================================================START OF VIDEO CALLING & CHAT SECTION============================================
let myVideoStream;
let mediaRecorder;

const messageContainer = document.getElementById('chat-window')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const recordButton = document.getElementById('record-button');
const downloadButton = document.getElementById('download-button');
const usernameDiv =document.getElementById('username');

function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  handleSuccess(stream);
  myVideoStream=stream;
  userstreams.push(myVideoStream);
  addVideoStream(myVideo, stream); //ADDING OUR OWN VIDEO TO THE STREAM
  muteUnmute();
  onOff();
}).catch(err=>{
  alert("Retry and give the app permission to use camera and microphone")
})

  myPeer.on('call', call => {                           //ANSWERING CALL FROM THE OTHER USER TRYING TO CONNECT TO US
    call.answer(stream)
    const video = document.createElement('video')
    video.setAttribute("controls","true")
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId,Name) => {                //SETTING UP CONNECTION WITH THE OTHER USER
    setTimeout(()=>{
        connectToNewUser(userId,stream);
    },1000);
    appendMessage(`${Name} connected`)
    // muteUnmute();
    // onOff();
  })
// })

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
  myPeer.destroy();
  window.location.href = "/";
})


myPeer.on('open', id => {
  // const Name = prompt('What is your name?')
  let Name = prompt('What is your name?')
  if(Name.trimEnd()==="")
    Name=prompt('Please let us know your name')
  appendMessage('You joined')
  usernameDiv.append(`Welcome ${Name}`);
  socket.emit('join-room', ROOM_ID, id,Name)

})

//CONNECTING TO NEW USER

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
    // peers[userId] = call
    userstreams.push(userVideoStream);
  })
  call.on('close', () => {
    video.remove()
  })
  currentPeer=call.peerConnection
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

//CHAT BOX DATA HANDLING

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
  

// ===================================================END OF VIDEO CALLING AND CHAT SECTIONS===================================================

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
      <i class="fas fa-microphone"></i>
    `
    document.querySelector('.mute-button').innerHTML = html;
    // document.querySelector('.mute-button1').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
    `
    document.querySelector('.mute-button').innerHTML = html;
    // document.querySelector('.mute-button1').innerHTML = html;
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
      <i class="fas fa-video"></i>
    `
    document.querySelector('.video-button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
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

//4.End whole Call

function endCall() {
    window.location.href = "/";
  }
//---------------------------------------------------------------------------------------------------------------------------------------


//5.Record Video and Download

  socket.on('record',()=>{
    alert("This meeting is now being recorded");
  })

  function Record() {
    if (recordButton.textContent === 'Record') {
      startRecording();
      socket.emit('record');
    } else {
      stopRecording();
      recordButton.textContent = 'Record';
      downloadButton.disabled = false;
    }
  }

  function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }
  function startRecording() {
    recordedBlobs = [];
    const options = { mimeType: "video/webm; codecs=vp9" };
    const getStreamForWindow = () => navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor:"always"
      },
    });

    const getStreamForCamera = () => navigator.mediaDevices.getUserMedia({
      audio: true
   });

   getStreamForCamera().then(streamCamera=>{

    getStreamForWindow().then(streamWindow => {
      let finalStream = new MediaStream();
      const videoTrack = streamWindow.getVideoTracks()[0];
      finalStream.addTrack(videoTrack);
      const audioTrack = streamCamera.getAudioTracks()[0];
      finalStream.addTrack(audioTrack);
      try{
        mediaRecorder=new MediaRecorder(finalStream,options);
      }catch(e){
        console.error('Exception while creating MediaRecorder:', e);
         return;
      }
      console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
      recordButton.textContent = 'Stop Record';
      downloadButton.disabled = true;
      mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
      };
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();
      console.log('MediaRecorder started', mediaRecorder);
    })

   })
  
  }
  
  function stopRecording() {
    mediaRecorder.stop();
  }

  function Download(){
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
  }

//---------------------------------------------------------------------------------------------------------------------------------------
//6.Screen-Share
const ShareScreen=()=>{
  navigator.mediaDevices.getDisplayMedia({
    video:{
      cursor:"always"
    },
    audio:{
      echoCancellation:true,
      noiseSuppression:true
    }
  }).then((stream)=>{
    let videoTrack = stream.getVideoTracks()[0];
    videoTrack.onended = function(){
      stopScreenShare();
    }
    let sender = currentPeer.getSenders().find(function(s){
      return s.track.kind==videoTrack.kind
    })
    sender.replaceTrack(videoTrack)
  }).catch((err)=>{
    console.log("unable to get display Media"+ err)
  })
}

const stopScreenShare=()=>{
  let videoTrack = myVideoStream.getVideoTracks()[0];
  let sender=currentPeer.getSenders().find(function(s){
    return s.track.kind==videoTrack.kind;
  })
  sender.replaceTrack(videoTrack);
}

//---------------------------------------------------------------------------------------------------------------------------------------

//7. WhiteBoard
socket.on('canvas-data',function(data){
  var image = new Image();
  var canvas =document.getElementById("can");
  var ctx=canvas.getContext('2d');
  image.onload=function(){
    ctx.drawImage(image,0,0);
  };
  image.src=data;
})

socket.on('clear-whiteboard',function(){
  alert("A user in the meet just cleared the whole whiteboard.Let them know if you are done too and clear the whiteboard at your end.")
})

socket.on('whiteboard',function(data){
  let x = document.getElementById("white-board");
  if(data==="open")
  {
    x.style.display = "block";
  }
  else {
    x.style.display = "none";
  }
})

const WhiteBoard=()=>{
  let x = document.getElementById("white-board");
  if (x.style.display === "none") {
    x.style.display = "block";
    socket.emit("whiteboard","open");
  } else {
    x.style.display = "none";
    socket.emit('whiteboard',"close");
  }
 
}

// const MyWhiteBoard=()=>{
//   let x = document.getElementById("white-board");
//   if (x.style.display === "none") {
//     x.style.display = "block";
//   } else {
//     x.style.display = "none";
//   }
// }

//---------------------------------------------------------------------------------------------------------------------------------------
//8. Icebreaker

socket.on('icebreaker',(news)=>{
  alert(news);
})

async function GetNews(){
  let headline = await axios.get("https://newsapi.org/v2/top-headlines?country=in&apiKey=c902a6b809a94b5285ae42f366267d00");
  let arr= headline.data.articles;
  let news=arr[Math.floor(Math.random() * arr.length)].title;
  alert(news);
  socket.emit('icebreaker',news);
}
//---------------------------------------------------------------------------------------------------------------------------------------
//9. Start and End Video Meet

socket.on('start-meet',function(){
  let x=document.querySelector(".call-area")
  x.style.display="flex";
  let y=document.querySelector(".only-call-chat-div")
  y.style.display="none";
  let z=document.querySelector(".chat-area")
  z.style.flex=0.25;
  // let a=document.querySelector(".mode-toggler-only-chat")
  // a.style.display="none";
  appendMessage("Video meeting started")
})

const startMeet=()=>{
  let x=document.querySelector(".call-area")
  x.style.display="flex";
  let y=document.querySelector(".only-call-chat-div")
  y.style.display="none";
  let z=document.querySelector(".chat-area")
  z.style.flex=0.25;
  // let a=document.querySelector(".mode-toggler-only-chat")
  // a.style.display="none";
  appendMessage("Video meeting started")
  socket.emit('start-meet');
}

socket.on('end-meet',function(){
  let x=document.querySelector(".call-area")
  x.style.display="none";
  let y=document.querySelector(".only-call-chat-div")
  y.style.display="flex";
  let z=document.querySelector(".chat-area")
  z.style.flex=0.8;
  // let a=document.querySelector(".mode-toggler-only-chat")
  // a.style.display="flex";
  appendMessage("Video meeting ended")
  //SWITCHING OFF USER AUDIO ON END OF VIDEO-MEET
  const audioEnabled = myVideoStream.getAudioTracks()[0].enabled;
    if (audioEnabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    }
  //SWITCHING OFF USER VIDEO ON END OF VIDEO-MEET
  const videoEnabled = myVideoStream.getVideoTracks()[0].enabled;
    if (videoEnabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    }

})

const endMeet=()=>{
  let x=document.querySelector(".call-area")
  x.style.display="none";
  let y=document.querySelector(".only-call-chat-div")
  y.style.display="flex";
  let z=document.querySelector(".chat-area")
  z.style.flex=0.8;
  // let a=document.querySelector(".mode-toggler-only-chat")
  // a.style.display="flex";
  appendMessage("Video meeting ended")
  //SWITCHING OFF USER AUDIO ON END OF VIDEO-MEET
  const audioEnabled = myVideoStream.getAudioTracks()[0].enabled;
    if (audioEnabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    }
  //SWITCHING OFF USER VIDEO ON END OF VIDEO-MEET
  const videoEnabled = myVideoStream.getVideoTracks()[0].enabled;
    if (videoEnabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    }
  socket.emit('end-meet');
}
//---------------------------------------------------------------------------------------------------------------------------------------

// 10. My Notes
const notesTaker=()=>{
  let x = document.getElementById("my-notes");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
 
}
