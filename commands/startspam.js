const notify = require('./helper/notify');

module.exports = {
	name: 'start',
    description: 'start spamming',
    aliases: ['play'],
	execute(msg) {
        if (!notify.getStatus() && notify.getChannel()) {
            notify.setStatus(true);
            msg.channel.send('spamming in ' + msg.channel.name + '!');
        } else if (!notify.getChannel()) {
            msg.channel.send('bind me to a text channel first!');
        } else {
            msg.channel.send('im already spamming!');
        }
	}
};