var Kinect2 = require('kinect2');
var kinect = new Kinect2();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
if(kinect.open()) {
	console.log("Kinect Opened");
	app.use(express.static(path.join(__dirname, 'public')));
	app.get('/', function(req, res) {
       // res.sendFile(__dirname + '/public/design/index.html');
       // res.sendFile(__dirname + '/public/tumbler-multer/index.html');
       res.sendFile(__dirname + '/public/tumbler-single/index.html');
    });
	//listen for body frames
	kinect.on('bodyFrame', function(bodyFrame){
		io.sockets.emit('bodyFrame', bodyFrame);
	});

	//request body frames
	kinect.openBodyReader();
	server.listen(8000);
}