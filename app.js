var Kinect2 = require('kinect2');
var kinect = new Kinect2();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

if(kinect.open()) {
	console.log("Kinect Opened");
	server.listen(8000);
	app.get('/', function(req, res) {
       res.sendFile(__dirname + '/public/index.html');
    });
	//listen for body frames
	kinect.on('bodyFrame', function(bodyFrame){
		// for(var i = 0;  i < bodyFrame.bodies.length; i++) {
		// 	if(bodyFrame.bodies[i].tracked) {
		// 		console.log(bodyFrame.bodies[i]);
		// 	}
		// }
		io.sockets.emit('bodyFrame', bodyFrame);
	});

	//request body frames
	kinect.openBodyReader();

	//close the kinect after 5 seconds
	// setTimeout(function(){
	// 	kinect.close();
	// 	console.log("Kinect Closed");
	// }, 5000);
}