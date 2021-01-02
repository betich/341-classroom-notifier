const SE = require('./Helper/Sendembed.js')

module.exports = {
	name: 'testembed',
	description: 'testembed!',
	execute(message) {
        console.log('hello');
        SE.sendembed(message);
	},
};