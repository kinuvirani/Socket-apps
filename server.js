var app=require('express')()
var http=require('http').createServer(app)
var io=require('socket.io').listen(http)

users=[];
connections=[];

app.get('/',function(req,res){
    res.sendfile("index.html")
})

io.sockets.on('connection',function(socket){
    connections.push(socket)
    console.log("Connected %s socket connected",connections.length);

    socket.on('disconnect',function(data){
        // if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1)
        updateUsers();
        connections.splice(connections.indexOf(socket),1)
    console.log("Disconnected %s socket connected",connections.length);
    })

    socket.on('sendMsg',function(data){
        console.log("data==",data)
        io.sockets.emit('newMsg',{msg:data,username:socket.username})
    })  
    socket.on('newUser',function(data,callback){
        callback(true)
        socket.username=data;
        users.push(socket.username)
        updateUsers();
    })
    function updateUsers(){
        io.sockets.emit('getUsers',users)
    }
})

http.listen(5000,()=>{
    console.log("Server Connected")
});