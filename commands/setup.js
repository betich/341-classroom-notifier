const notify = require('./helper/notify.js');
const fs = require('fs');
const { Message } = require('discord.js');
const cfgPath = './config.json';

module.exports = {
	name: 'setup',
    description: 'set bot up in a channel',
    aliases: ['bind'],
	execute(msg) {
        if (notify.getChannel() !== msg.channel.id) {
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