
"use strict";

var express 	= require('express'),
	app    		= express(),
	server 		= require('http').Server(app),
	bodyParser 	= require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;


app.set('views', './views');  
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));



app.use(function(req, res, next) 
{

	console.log('middleware called');

	next();

});

app.get('/', function(req, res) {

	res.render('index'); 

});


server.listen(port);
