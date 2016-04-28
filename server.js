
"use strict";

var express 	= require('express'),
	app    		= express(),
	server 		= require('http').Server(app),
	bodyParser 	= require('body-parser'),

	fs 			= require('fs'),
	glob 		= require('glob'),
	marked 		= require('marked'),
	toml 		= require('toml');


app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());


app.set('views', './views');  
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));



app.use(function(req, res, next) 
{

	console.log('middleware called');

	next();

});



var Chief = function Chief()
{

	var Chief = {};

	Chief.map = {};

	Chief.recurse = function recurse( file, object, dirs )
	{

		if ( dirs[0].indexOf('.toml') != -1 )
		{
			object[ dirs[0].replace('.toml','') ] = toml.parse(fs.readFileSync(file, 'utf8'));
		}
		else if ( dirs[0].indexOf('.md') != -1 )
		{

			var data 		= fs.readFileSync(file, 'utf8'),
				document 	= toml.parse(data.split('+++')[1]);

			document.markdown = marked(data.split('+++')[2]);

			if ( object.hasOwnProperty('local') )
			{
				object.local.push( document );
			}
			else
			{
				object.local = [ document ];
			}
		}
		else
		{
			// test if object has key
			if ( object.hasOwnProperty( dirs[0] ) )
			{
				var newObject = object[ dirs[0] ];
			}
			else
			{
				var newObject = object[ dirs[0] ] = {};
			}
			
			dirs.shift();

			Chief.recurse( file, newObject, dirs );
		}

	}


	Chief.init = function init()
	{

		var files = glob.sync('./content/**/*.*(md|toml)');
		

			// if ( err )
			// {
			// 	console.log(err);
			// }
			// else
			// {

				for ( var file = 0; file < files.length; file++ )
				{

					var dirs = files[file].replace('./content/', '').split('/');

					Chief.recurse( files[file], Chief.map, dirs );

				}
			// }

			// console.log(Chief.map);
		return Chief.map;

	}

	Chief.init();

	// console.log(Chief.map);
	
	app.get('*', function(req, res) {
console.log({
			
			Chief : Chief.map

		});

		res.render('index', 
		{
			
			Chief : Chief.map

		});

	});

}();

// Chief();

// var Clara = Chief();

// console.log(Chief.init());

// app.get('*', function(req, res) {


// 	res.render('index', 
// 	{
		
// 		Chief : Chief.map

// 	});

// });


server.listen( process.env.PORT || 8080 );
