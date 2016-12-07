
const Chief = require('chief');


const piggy = (req, res) => {
	console.log('piggy in the middleware');
};

const chief = new Chief({
	middleware : [piggy],
	error : 'error',
	port : 1111
});
