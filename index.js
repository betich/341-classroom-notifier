const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const prefix = config.prefix;
const token = require('./token.json').token;
const onlineClass = require('./OnlineClass/onlineClass.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`loaded ${command.name}`);
}

client.once('ready', () => {
	client.channels.fetch(config.default_channel)
	.then (chan => {
		const tmp = require('./OnlineClass/testObject.json');
		const OC1 = new onlineClass(tmp[0]);
		const OC2 = new onlineClass(tmp[1]);
		chan.send('These 2 Message are for testing.');
		OC1.sendEmbed(chan);
		OC2.sendEmbed(chan);

		//
		// SetInterval for auto
		//

	})
	.catch (error => {
		console.error(error);
	})

	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

try {
    client.login(token);
} catch (error) {
    console.error('Can\'t login with this token / token missing');
    console.error(error);
}