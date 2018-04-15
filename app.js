var Kinect2 = require('kinect2');
var kinect = new Kinect2();
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (kinect.open()) {
  console.log("Kinect Opened");
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/tumbler-single/index.html');
  });
  app.get('/multer', function(req, res) {
    res.sendFile(__dirname + '/public/tumbler-multer/index.html');
  });

  app.get('/pad', function(req, res) {
    res.sendFile(__dirname + '/public/tumbler-pad/index.html');
  })
  app.post('/addShape', function(req, res) {
    var type = req.body.type || 'rect'
    var fill = req.body.fill || '#679fab'
    io.sockets.emit('addShape', { type, fill })
    res.json({
      code: 0,
      msg: '成功'
    })
  })
  //listen for body frames
  kinect.on('bodyFrame', function(bodyFrame) {
    io.sockets.emit('bodyFrame', bodyFrame);
  });

  //request body frames
  kinect.openBodyReader();
  server.listen(8000);
}