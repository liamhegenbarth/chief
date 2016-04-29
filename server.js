
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

	Chief.recurse = function recurse( file, object, dirs, depth )
	{
		// console.log(dirs);

		if ( depth > 0 )
		{
			// object.meta = {

			// 	depth 	: depth,
			// 	dirs 	: dirs[0],
			// 	slug 	: file.replace('./content/', '').split(dirs[0])[0] + dirs[0].replace(/.toml|.md/g,'')

			// }
		}


		if ( dirs[0].indexOf('.toml') != -1 )
		{
			object[ dirs[0].replace('.toml','') ] = toml.parse(fs.readFileSync(file, 'utf8'));
		}
		else if ( dirs[0].indexOf('.md') != -1 )
		{

			var data 		= fs.readFileSync(file, 'utf8').split('+++'),
				document 	= toml.parse(data[1]);

			document.markdown = marked(data[2]);

			if ( depth > 0 )
			{
				if ( object.hasOwnProperty('local') )
				{
					object.local.push( document );
				}
				else
				{
					object.local = [ document ];
				}
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
				var newObject = object[ dirs[0] ] = {

					meta : {

						depth 	: ++depth,
						slug 	: dirs[0],
						href 	: '/' + dirs[0],
						path 	: file.replace('./content/', '').split(dirs[0])[0] + dirs[0].replace(/.toml|.md/g,'')

					}
				};
			}
			
			dirs.shift();

			Chief.recurse( file, newObject, dirs, ++depth );
		}

	}


	Chief.init = function init()
	{

		var files = glob.sync('./content/**/*.*(md|toml)');

		for ( var file = 0; file < files.length; file++ )
		{

			var dirs = files[file].replace('./content/', '').split('/');

			Chief.recurse( files[file], Chief.map, dirs, 0 );

		}

	}

	Chief.init();


	
	app.get('*', function(req, res) {

		console.log(req.url);

		// console.log(Chief.map);

		console.log(Chief.map.cases);

		console.log({
			
			Chief : Chief.map

		});

		res.render('index', 
		{
			
			Chief : Chief.map

		});

	});

}();



server.listen( process.env.PORT || 8080 );
