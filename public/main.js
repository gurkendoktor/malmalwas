	var chat;
	var canvasContext;
	var user = {};
	var drawingProperties;
	var drawSizes = [];

	//user.id = Math.round(Math.random() * 100000000);
	user.drawSize = 2;

	window.onload = function () {

			user.drawSize = 2;
			user.drawColor = 0x000000;


        document.getElementById('drawSize').onchange = function(e){
           user.drawSize = parseInt(e.target.value, 10);
	        socket.emit('propertychange',user)
        };
        var socket = io();

		socket.on('connect', function(data){
            console.log(socket);
			user.id = socket.id;
            user.sessionid = socket.id;
        });

		socket.on('propertychange', function(data){
			console.log(data.id)
			drawSizes[data.id] = data.drawSize;
		});

		socket.on('initialdata',function(data){

			console.log('initial data received');
			console.log(data);
		});

        socket.on('draw',function(data){
	        console.log(data);
	        var width = drawSizes[data.id];
	        console.log(width);
            drawToCanvas(canvasContext, data.x, data.y, data.id, width);
        });
        socket.on('drawingDidEnd', function(data){
            prevPoints[data.id] = {};
            console.log("END OF TRANSMISSION FROM URANUS RECEIVED");

        });

        var container = document.getElementById('canvas');
        canvasContext  = init(socket, container, 800, 450, '#03A9F4');

	}
