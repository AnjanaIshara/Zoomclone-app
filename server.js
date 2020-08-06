const express=require('express');
const app=express();
const server= require('http').Server(app);
const io=require('socket.io')(server);
app.set('view engine','ejs');
const {v4:uuidv4}=require('uuid');
app.use(express.static('public'));
const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{
    debug:true
});

app.use('/peerjs',peerServer);

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room',(req,res)=>
{
    res.render('room',{roomID:req.params.room})
})
io.on('connection',socket=>{
    socket.on('join-room',(roomID,userId)=>{
        socket.join(roomID);
        socket.to(roomID).broadcast.emit('user-connected',userId);
        socket.on('message',message=>{
            io.to(roomID).emit('createMessage',message)
        })
        })
})
server.listen(process.env.PORT||3030);