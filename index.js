var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/images', express.static(__dirname + '/images'));
app.set('view engine', 'pug');

var currentSlide = 0;

var texts = {};

io.sockets.on('connection', function (socket) {
    socket.on('slide', function (message) {
	currentSlide = message;
        socket.broadcast.emit('slide', currentSlide);
    });

    socket.on('text', function (message) {
	if (!(texts[message.key]))
	    texts[message.key] = {};
	texts[message.key][socket.id] = message.content;
	var summarized = Object.keys(texts[message.key]).map( function(i) {
	    return texts[message.key][i]; }).join(" ");
        socket.broadcast.emit('text', {key: message.key, content: summarized });
        socket.emit('text', {key: message.key, content: summarized });	
    });    
});

app.get('/', function (req, res) {
    res.render('index', { presenter: false, slide: currentSlide });
});

app.get('/presenter', function (req, res) {
    res.render('index', { presenter: true, slide: currentSlide });
});

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
