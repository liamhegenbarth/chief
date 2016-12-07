# Chief v0.0.1

`Work in progress :)`

A simple yet powerful static site generator, designed to take the hassle out of getting an easy to maintain site up and running quickly. 

Fuses the power of templating and config files in development mode with the speed and simplicity of static pages in production mode.

## Getting Started
Run `$ node chief` inside project directory to start server. Defaults to dev environment.


## Features
- Directory based site structure - how you organise folders and files correspond to the pages of your site
- Global, local and inline config files allow you to define data across all templates
- Write all your content in Markdown
- Choice of config language (TOML and HUML at present)
- Choice of templating engine (only Pug at present) in development mode to compile static files from
- Automatically compile templates into a static files with a single command
- Chief accepts a variety of configuration options to control site structure and templating
- Middleware options to extend basic Express server routes
- Define your own naming convention for where Chief stores and finds files


## Options

### Middleware
Pass array of functions to be called as middleware. Order passed is order they run.

```
type 	: array
default : false
options : [array] | false
```

### Engine
Set the template engine for Chief to render data with.

```
type 	: string
default : 'pug'
options : 'pug'
```

### Public
Set directory of static assets for Chief to serve.

```
type 	: string
default : './public'
options : './path/to/directory'
```

### Views
Set directory where Chief can find all of your views (templates).

```
type 	: string
default : './views'
options : './path/to/directory'
```

### Content
Set directory where Chief can find all of your content files to render

```
type 	: string
default : './content'
options : './path/to/directory'
```

### Compiled
Set directory where Chief will output compiled static files after render

```
type 	: string
default : './compiled'
options : './path/to/directory'
```

### Error
Set path to error templates within views directory

```
type 	: string
default : 'errors/error'
options : '/path/to/template'
```

### Index
Set name of index file. Chief will serve the index file is served if root of directory is requested.

```
type 	: string
default : 'index'
options : 'filename'
```

### Divider
Set a divider for inline config options. Chief will use this to distinguish between config and content data.

```
type 	: string
default : '+++'
options : any
```

### Port
Set the port that Chief will run on

```
type 	: integer
default : 8080
options : any
```

## Options (Planned)

### Extension
Set a custom file extension for markdown content files.

```
type 	: string
default : 'md'
options : any
```

### Config
Set the language for all config data.

```
type 	: string
default : 'huml'
options : any
```


## Examples
```javascript
    const Chief = require('chief');
    
    const piggy = (req, res) => {
      console.log('piggy in the middleware');
    };
    
    const chief = new Chief({
      middleware : [piggy],
      port : 1111
    });
```


## To Do

- Sort static file conflict with normal route
- Production environment server
- Commands

