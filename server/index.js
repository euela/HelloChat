import express from "express";
import dotenv from 'dotenv';
import configDB from './api/config/db.js';
import userRouter from './api/routes/authRoutes.js';
import cookieParser from "cookie-parser";
import chatRouter from './api/routes/chatRoutes.js';
import messageRouter from './api/routes/messageRoutes.js';
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config()
configDB()

const app = express();
const PORT = process.env.PORT 
const server = createServer(app)

app.use(express.json())
app.use(cookieParser());


app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)

server.listen(PORT,()=>{
    console.log(`server running on port: ${PORT}`)
})

const io = new Server(server,{
  pingTimeout: 60000,
  cors:({
    origin: "http://localhost:4000", // Whitelist the allowed origin
    credentials: true, // Enable credentials support if needed
  })
})

io.on("connection",(socket)=>{
  console.log("connected on socket.io")
  socket.on('setup',(userData)=>{
    socket.join(userData._id)
    console.log(userData._id+'user: 1')
    socket.emit("connected")
  })

  socket.on('join chat',(room)=>{
    socket.join(room)
    console.log("user joined " + room)
  })

  socket.on('typing',(room)=>{
    socket.to(room).emit('typing');
    console.log('typing')
  })

  socket.on('stop typing',(room)=>{
   socket.to(room).emit('stop typing');
  })

  socket.on('new message',(newMessageReceived)=>{
    var chat = newMessageReceived.chat
    if(!chat) return console.log('chat.users is not defined')
    chat.users.forEach(user=>{
      if(user._id == newMessageReceived.sender._id){ 
        return;
      }
         socket.in(user._id).emit('message received',newMessageReceived)
         console.log('messages sent')
      })
  })


})

app.use((err, req, res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    })
})
