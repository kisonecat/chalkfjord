var express = require('express');
var app = express();

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
