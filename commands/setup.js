const notify = require('./helper/notify.js');
const fs = require('fs');
const { config } = require('process');

module.exports = {
	name: 'setup',
    description: 'set bot up in a channel',
    aliases: ['bind'],
	execute(msg) {
        if (notify.getChannel() !== msg.channel) {
            notify.setChannel(msg.guild.channels.cache.get(msg.channel.id));
            msg.channel.send(`bound to <#${msg.channel.id}> !`);
            cfg = require('../config.json');
            const m = JSON.stringify({...cfg,default_channel: msg.channel.id}, null, 4);
            console.log(m);
            //thank for helping
            fs.writeFileSync('../config.json', m, (err) => {
                if(err) console.error('cant write file');
            });
        } else {
            msg.channel.send('already bound!');
        }
	}
};