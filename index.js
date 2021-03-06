// setting up the server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));


var users = [];
var numUsersOnline = 0;

io.sockets.on('connection', function (socket) {
    console.log('connection from ' + socket.id);
    //socket.emit('initialdata',users);
    users[socket.id] = {};
    numUsersOnline++;
    socket.emit('userDidJoin', numUsersOnline);
    socket.broadcast.emit('userDidJoin', numUsersOnline)

    socket.on('connect', function (data) {
        console.log('id ' + socket.id);
        console.log(data);
    });
    socket.on('disconnect', function (data) {
        numUsersOnline--;
        socket.broadcast.emit('userDidJoin', numUsersOnline);
    });

    socket.on('propertychange', function (data) {
        //update user
        users[data.sessionid] = data;
        socket.broadcast.emit('propertychange', data);
    });

    socket.on('draw', function (data) {
        console.log('drawing to ' + data.x + ' : ' + data.y);
        socket.broadcast.emit('draw', data);
    });

    socket.on('end', function (data) {
        socket.broadcast.emit('drawingDidEnd', data);
    })

});
