const SE = require('./helper/sendembed.js')

module.exports = {
	name: 'testembed',
	description: 'testembed!',
	aliases: [],
	execute(message) {
        console.log('hello');
        SE.sendembed(message);
	}
};