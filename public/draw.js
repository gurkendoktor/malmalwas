

// Creates a new canvas element and appends it as a child
// to the parent element, and returns the reference to
// the newly created canvas element

var users;

function createCanvas(parent, width, height) {
    var canvas = {};
    canvas.node = document.createElement('canvas');
    canvas.context = canvas.node.getContext('2d');
    canvas.node.width = width || 100;
    canvas.node.height = height || 100;
    parent.appendChild(canvas.node);
    return canvas;
}

function init(socket, container, width, height, fillColor, strokeWidth) {
    var canvas = createCanvas(container, width, height);
    var ctx = canvas.context;
    ctx.strokeStyle = "#ffffff";

    // define a custom fillCircle method
    ctx.fillCircle = function (x, y, radius, fillColor) {
        this.fillStyle = fillColor;
        this.beginPath();
        this.moveTo(x, y);
        this.arc(x, y, radius, 0, Math.PI * 2, false);
        this.fill();
    };
    ctx.clearTo = function (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, width, height);
    };
    ctx.clearTo(fillColor || "#ffffff");

    var prevPoint = {};

    // bind mouse events
    canvas.node.onmousemove = function (e) {
        if (!canvas.isDrawing) {
            return;
        }
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        
        if (prevPoint && prevPoint.x && prevPoint.y) {
            ctx.lineWidth = user.drawSize;
            ctx.beginPath();
            //ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, x, y);
            ////ctx.lineTo(x, y);
            //ctx.quadraticCurveTo(x, y, x, y);
            ctx.stroke();            
        }
        var radius = user.drawSize / 2; // or whatever
        var fillColor = '#ffffff';
        ctx.fillCircle(x, y, radius, fillColor);
        prevPoint.x = x;
        prevPoint.y = y;
        sendPoint(socket, prevPoint);
    };
    canvas.node.onmousedown = function (e) {
        canvas.isDrawing = true;

    };
    canvas.node.onmouseup = function (e) {
        canvas.isDrawing = false;
        sendPoint(socket, prevPoint);
        sendPoint(socket, null);
        prevPoint.x = undefined;
        prevPoint.y = undefined;
    };

    return ctx;
}

function sendPoint(socket, point) {
    if (point == null) {
        console.log("END OF TRANSMISSION FROM URANUS");
        socket.emit('end', { id: user.sessionid });
        return;
    }
    socket.emit('draw', {
        x: point.x,
        y: point.y,
        id: user.sessionid
    });
}

var prevPoints = [];

function drawToCanvas(context, x, y, id, strokeWidth) {
    if (prevPoints[id]) {
        if (prevPoints[id].x && prevPoints[id].y) {
            context.lineWidth = strokeWidth;
            context.beginPath();
            //var c = (prevPoints[id].x + x) / 2;
            //var d = (prevPoints[id].x  + y) / 2;
            context.moveTo(prevPoints[id].x, prevPoints[id].y);
            context.closePath();
            context.quadraticCurveTo(prevPoints[id].x ,prevPoints[id].y,x,y);
            context.stroke();
        }
    }
    else {
        prevPoints[id] = {};
    }

    var radius = strokeWidth / 2; // or whatever
    var fillColor = '#ffffff';
    context.fillCircle(x, y, radius, fillColor);
    prevPoints[id].x = x;
    prevPoints[id].y = y;
}




