const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)
const dotenv = require('dotenv')
const axios = require('axios')

dotenv.config()

app.get('/',(req,res)=>{
    res.send('Node server is up and running...')
})

let users = []


//server io logic

io.on('connection',(socket)=>{
    socket.on('join',(username)=>{
        let user = users.find((item) => item === username)
        if(user){
            io.to(socket.id).emit('on-join',false)
        }
        else{
            socket.join(username) //assign the username to the current socket
            socket.handshake.query.username = username
            users.push(username)
            io.to(socket.id).emit('on-join',true)

        }
    })

 //
 socket.on('call',({usrename,offer})=>{
     console.log('Call',username)
     let user = users.find((user) => user === username)
     if(user){
        const me =  user.handshake.query.username 
        console.log('Call to ',username)
        io.to(username).emit('on-call',{username : me,offer})
     }
     else{
         console.log('User not found!!')
     }
 })


 socket.on('answer',({username,answer}) =>{
     let user = users.find((user) => user === username)
    if(user){
        console.log('Answer to ',username)
        io.to(username).emit('on-answer',answer)
    }
 })

 socket.on('candidate',({username,candidate}) =>{
    let user = users.find((user) => user === username)
   if(user){
       console.log('candidate to ',username)
       io.to(username).emit('on-candidate',answer)
   }
})

socket.on('disconnect',()=>{
    const {username} = socket.handshake.query
    if(username){
        const index = users.findIndex((item) => item === username)
        if(index !== -1){
            users.splice(index,1)
        }

    }
})

})

server.listen(port,()=>{
    console.log('Server is up and running on '+port)
})