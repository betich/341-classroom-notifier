const notify = require('./helper/notify.js');
const fs = require('fs');
// const { config } = require('process');
const cfgPath = './config.json';

module.exports = {
	name: 'setup',
    description: 'set bot up in a channel',
    aliases: ['bind'],
	execute(msg) {
        if (notify.getChannel() !== msg.channel) {
            notify.setChannel(msg.guild.channels.cache.get(msg.channel.id));
            msg.channel.send(`bound to <#${msg.channel.id}>!`);
            fs.readFile(cfgPath, (err, data) => {
                if (err) throw err;
                let cfg = JSON.parse(data);

                cfg.default_channel = msg.channel.id;
                
                fs.writeFile(cfgPath, JSON.stringify(cfg), (err) => {
                    if (err) throw err;
                    console.log(`changed defualt channel to ${msg.channel.name}`);
                });
            });
        } else {
            msg.channel.send('already bound!');
        }
	}
};