const notify = require('./helper/notify.js');
const fs = require('fs');
const cfgPath = './config.json';

module.exports = {
	name: 'bind',
    description: 'Set bot up in a channel',
    aliases: ['setup', 'b'],
    uses: 'bind',
	execute(msg) {
        if (!notify.getChannel() || notify.getChannel().id !== msg.channel.id) {
            notify.setChannel(msg.guild.channels.cache.get(msg.channel.id));
            msg.channel.send(`bound to <#${msg.channel.id}>!`);
            fs.readFile(cfgPath, (err, data) => {
                if (err) throw err;
                fs.writeFile(cfgPath, JSON.stringify({...JSON.parse(data), default_channel: msg.channel.id}, null, 4), (err) => {
                    if (err) throw err;
                    console.log(`changed default channel to ${msg.channel.name}`);
                });
            });
        } else {
            msg.channel.send('already bound!');
        }
	}
};