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
        var socket = io.connect('188.226.133.237:8010',function(){
            console.log('on connect');
        });

		socket.on('connect', function(data){
			user.id = socket.socket.sessionid;
            user.sessionid = socket.socket.sessionid;
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
        canvasContext  = init(socket, container, 400, 300, '#fafafa');

	}
