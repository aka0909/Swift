const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
// const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { v4: uuidV4 } = require('uuid')



app.set('view engine', 'ejs') 
app.use(express.static('public'))
app.use(express.json())


app.get('/', (req, res) => {
  res.render('home')
})
app.get('/join-create',(req,res)=>{
  res.render('join-create')
})
app.get("/get-started/",(req,res)=>{
  res.redirect('/join-create')
})

app.get("/create-room/", (req, res) => {
    res.redirect(`/${uuidV4()}`);
  });

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

//MAIL-INVITE ROUTE
app.post('/:room/invite', (req,res)=>{
  console.log(req.body)
  const obj=JSON.parse(JSON.stringify(req.body));

  const output = `
  <p>You have a meet request!</p>
  <h3>Call Details:</h3>
  <ul>  
    <li>Name: ${obj.name}</li>
    <li>Email: ${obj.email}</li>
    <li>Meet-Link: ${obj.link}</li>
  </ul>`;

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'akanksha09092k@gmail.com',
          pass: 'mithi2000'
      }
  });

  var receiver=obj.email;
  
  const mailOptions = {
      from: 'akanksha09092k@gmail.com', // sender address
      to: receiver, // list of receivers
      subject: 'Meet mail', // Subject line
      html: output// plain text body
  };
  
  transporter.sendMail(mailOptions, function (err, info) {
      if(err)
          console.log(err)
      else
          {console.log(info);res.status(200).json({
              status:'Success'
          })
      }
  });   

})



const users = {}

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId,Name) => {
    socket.join(roomId)
    users[socket.id] = Name
    socket.to(roomId).emit('user-connected', userId,Name)
    
    socket.on('send-chat-message', message => {
        socket.to(roomId).emit('chat-message', { message: message, name: users[socket.id] })
      })

    socket.on('canvas-data',data=>{
      socket.to(roomId).emit('canvas-data',data);
    })

    socket.on('whiteboard',(data)=>{
      socket.to(roomId).emit('whiteboard',data);
    })

    socket.on('record',()=>{
      socket.to(roomId).emit('record');
    })

    socket.on('icebreaker',(news)=>{
      socket.to(roomId).emit('icebreaker',news);
    })

    socket.on('start-meet',()=>{
      socket.to(roomId).emit('start-meet');
    })

    socket.on('end-meet',()=>{
      socket.to(roomId).emit('end-meet');
    })
    
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
      delete users[socket.id]
    })
  })
})

server.listen(3000)