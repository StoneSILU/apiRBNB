var express = require('express');
var app = express();
var port = 3000;
var routes = require('./routes')

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use('/',routes)
var io = require('socket.io').listen(
    app.listen(port, function(){
        console.log('server listenning on port : '+port);
    })
);

var mongoose = require('mongoose');
mongoose.connect('mongodb://stivynho:Undertaker94@airbnpito-shard-00-00-4vdbk.mongodb.net:27017,airbnpito-shard-00-01-4vdbk.mongodb.net:27017,airbnpito-shard-00-02-4vdbk.mongodb.net:27017/airbnb?ssl=true&replicaSet=AirBnPito-shard-0&authSource=admin');
var db = mongoose.connection;

db.on('error', function() { console.log(' MongoDB -> connection error to database'); });
db.once('open', function() { console.log(' MongoDB ->  connected to database'); });

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
})