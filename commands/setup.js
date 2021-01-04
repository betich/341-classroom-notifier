const notify = require('./helper/notify');

module.exports = {
	name: 'setup',
    description: 'set bot up in a channel',
    aliases: ['bind'],
	execute(msg) {
        notify.setChannel(msg.guild.channels.cache.get(msg.channel.id));
        notify.setStatus(true);
	}
};