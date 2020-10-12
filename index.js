require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const socketio = require('socket.io') // add socket
const http = require('http')
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter")

// set up express
const app = express();
app.use(bodyParser.json({ extended: false }));
app.use(cors());

//setup socket.io
const server = http.createServer(app)
const io = socketio(server)

//call controller methods
const { addUser, removeUser, getUser, getUsersInRoom } = require('./controllers/chatController')

// route
app.use("/users", userRouter);
app.use("/", chatRouter)

// Socket method
io.on('connection', (socket) => {
  console.log('Connection is working') //message to test connection

  socket.on('join', ({username ,room}, callback) => {
    // console.log(username)
    // console.log(room)
    const { error, user } = addUser({id: socket.id, username, room})

    // if(error) return callback(error)


    socket.emit('message', {user: 'admin', text: `${user.username}, Welcome to the room ${user.room}`})
    socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.username} has joined the room`})

    socket.join(user.room)

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

    callback()

  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    console.log('socket user: ', user);
    io.to(user.room).emit('message', {user: user.username, text: message})
    io.to(user.room).emit('roomData', {user: user.room, text: message})


    callback()
  })

  socket.on('disconnect', () => {
    console.log("User left")
    const user = removeUser(socket.id)

    if(user) {
      io.to(user.room).emit('message', {user: 'admin', text: `${user.username} has left the chat`})
    }
  })
})

const SERVERPORT = process.env || 3000
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to Database!");
    server.listen(PORT, () =>
      console.log(`The server has started on port: ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
