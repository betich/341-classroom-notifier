const notify = require('./helper/notify');

module.exports = {
	name: 'stop',
    description: 'stop spamming',
    aliases: ['s', 'stopspamming'],
	execute(msg) {
		notify.setStatus(false);
		msg.channel.send('stopped spamming')
	}
};