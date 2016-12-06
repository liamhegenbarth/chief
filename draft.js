
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

	console.log('\n++++++++++\nMIDDLEWARE\n++++++++++\n');

	next();

});


String.prototype.capitalise = function()
{
	return this.toLowerCase().replace(/-|_/g,' ').replace(/(?:^|\s)\S/g, function(l) { return l.toUpperCase(); });
}


var Chief = function Chief()
{

	var Chief = {};

	Chief.map = {};

	Chief.recurse = function recurse( file, object, dirs, depth )
	{
		
		// create new key for config file
		if ( dirs[0].indexOf('.toml') != -1 )
		{
			object[ dirs[0].split('.toml')[0] ] = toml.parse(fs.readFileSync(file, 'utf8'));
		}
		// create new key for page
		else if ( dirs[0].indexOf('.md') != -1 )
		{

			var filename 	= dirs[0].split('.md')[0],
				data 		= fs.readFileSync(file, 'utf8').split('+++'),
				path 		= file.replace('./content/', '').split(dirs[0])[0],
				document 	= toml.parse(data[1]);

			document.markdown = marked(data[2]);

			if ( !document.hasOwnProperty('title') )
			{
				document.title = filename.replace(/-/g, ' ').capitalise();
			}

			if ( !document.hasOwnProperty('slug') )
			{
				document.slug = filename;
			}

			if ( !document.hasOwnProperty('path') )
			{
				document.path = `/${path}`;
			}

			if ( !document.hasOwnProperty('href') )
			{
				document.href = `/${path}${filename}`;
			}

			if ( !document.hasOwnProperty('depth') )
			{
				document.depth = ++depth;
			}

console.log(document);
console.log('+++++');

			if ( depth > 0 )
			{

				if ( dirs[0].indexOf('index.md') != -1 )
				{
					object[filename] = document;
				}
				else
				{
					if ( !object.hasOwnProperty('pages') )
					{
						object.pages = {};
					}
					
					object.pages[filename] = document;
				}

			}
		}
		// create new key for directory
		else
		{
			if ( !object.hasOwnProperty('pages') )
			{
				object.pages = {};
			}

			// test if object has key
			if ( object.pages.hasOwnProperty( dirs[0] ) )
			{
				var newObject = object.pages[ dirs[0] ];
			}
			else
			{
				var newObject = object.pages[ dirs[0] ] = {};
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

console.log('++++\nPAGES\n++++');

	Chief.init();

console.log('++++\nDATA\n++++');
console.log(JSON.stringify(Chief.map));


	
	app.get('*', function(req, res) {

console.log('+++++++\nREQUEST\n+++++++');

console.log(`Request : ${req.url}`);

		var dirs = req.url.split('/').filter(function(e){return e;});

		var exists = function exists( object, dirs )
		{

			var keys 	= Object.keys(object),
				dir 	= dirs[0];

			// if it's not an endpoint, pass through
			if ( keys.length > 0 && dirs.length > 0 && keys.indexOf( dir ) != -1 )
			{
console.log(`Dirs : /${dirs[0]}`);
				dirs.shift();
				exists( object[dir], dirs );
			}
			// if its an endpoint, pass through pages
			else if ( keys.indexOf('pages') != -1 )
			{
console.log(`Pages : /${dirs[0]}`);
				exists( object['pages'], dirs );
			}
			// endpoint reached
			else
			{
console.log('Endpoint reached');
				return;
			}
			

		} ( Chief.map, dirs );


		// try loading the page
		var data = fs.readFile('./content' + req.url + '.md', 'utf8', function(err, data)
		{

			// if it fails, we assume its a section, so look for the index page
			if ( err )
			{
				// console.log(err);
				// var url = req.url.split('/').filter(function(e){return e;});

				// if ( url.length > 1 ) url.pop();

				// url = url.join('/');

				// try loading the index page
				var data = fs.readFile('./content/' + req.url + '/index.md', 'utf8', function(err, data)
				{

					// if it fails, the page doesn't exist at all, 404
					if ( err )
					{
console.log('404');
						// console.log(err);

						res.render('error', 
						{
							
							Chief : Chief.map

						});
					}
					// index page does exist, so render template
					else
					{
console.log('Found index page');

						data = data.split('+++');

						Chief.map.local 			= toml.parse(data[1]);
						Chief.map.local.markdown 	= marked(data[2]);

						res.render('index', 
						{
							Chief : Chief.map
						});
					}
				});

			}
			// normal page does exist, so render template
			else
			{

console.log('Found child page');

				data = data.split('+++');

				Chief.map.local 			= toml.parse(data[1]);
				Chief.map.local.markdown 	= marked(data[2]);

				res.render('index', 
				{
					Chief : Chief.map
				});
			}

		});

	});

}();


server.listen( process.env.PORT || 8080 );
