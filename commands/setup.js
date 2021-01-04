const notify = require('./helper/notify');

module.exports = {
	name: 'setup',
    description: 'set bot up in a channel',
    aliases: ['bind'],
	execute(msg) {
        if (notify.getChannel() !== msg.channel) {
            notify.setChannel(msg.guild.channels.cache.get(msg.channel.id));
            msg.channel.send('bound to ' + msg.channel.name + '!');
        } else {
            msg.channel.send('already bound!');
        }
	}
};