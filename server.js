const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')



app.set('view engine', 'ejs') 
app.use(express.static('public'))

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

const users = {}

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId,Name) => {
    socket.join(roomId)
    users[socket.id] = Name
    socket.to(roomId).emit('user-connected', userId,Name)
    
    socket.on('send-chat-message', message => {
        socket.to(roomId).emit('chat-message', { message: message, name: users[socket.id] })
      })
    
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
      delete users[socket.id]
    })
  })
})

server.listen(3000)