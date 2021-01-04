const notify = require('./helper/notify.js');

module.exports = {
	name: 'stop',
    description: 'stop spamming',
    aliases: ['s', 'stopspamming'],
	execute(msg) {
		notify.setStatus(false);
	}
};