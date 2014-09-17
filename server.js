var path = require('path');
var qs = require('querystring');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var request = require('request');

var config = require('./config');

//user model
//mongoose.connect(config.MONGO_URI);
mongoose.connect("mongodb://geoffrey:Gdg078412!@proximus.modulusmongo.net:27017/r4Yxogom");

var app = express();


app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Force HTTPS on Heroku
if (app.get('env') === 'production') {
	app.use(function (req, res, next) {
		var protocol = req.get('x-forwarded-proto');
		protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
	});
}

app.use(express.static(__dirname + '/public'));

require('./routes')(app);




app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});



























