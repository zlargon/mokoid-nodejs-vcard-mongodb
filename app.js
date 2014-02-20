
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var busboy = require('connect-busboy');
var hello = require('./routes/hello');
var api = require('./routes/api');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vcard');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('MongoDB: connected.');	
});

var userSchema = new mongoose.Schema({
    name:    { type: String, default: "" },
    phone:   { type: String, default: "" },
    email:   { type: String, default: "" },
    address: { type: String, default: "" },
    age:     { type: Number, default: 0 }
});

app.db = {
	model: mongoose.model('user', userSchema)
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(busboy({ immediate: true }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'frontend')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// REST API
app.post('/1/user', api.create);
app.get('/1/user', api.read);
app.put('/1/user/:nickname', api.update);
app.delete('/1/user/:nickname', api.delete);


// Profile
app.post('/1/user/:nickname/:type', api.upload);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
