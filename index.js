const fs 		= 	require('fs');
const Discord 	= 	require('discord.js');
const config 	= 	require('./config.json');
const token		= 	require('./token.json').token;
const onlineClass = require('./onlineclass/onlineClass.js');
const prefix 	= 	config.prefix;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
	let command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	command.aliases.forEach((alias) => {
		if (alias) client.commands.set(alias, command);
	})
    console.log(`loaded ${command.name}`);
});

client.once('ready', () => {
	client.user.setActivity('Pisanu', { type: 'LISTENING'});
	client.channels.fetch(config.default_channel)
	.then (chan => {
		//
		// SetInterval for auto
		//

	})
	.catch (error => {
		console.error('Error binding')
		console.error(error);
	})
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return message.channel.send('unknown command i sus');;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		message.reply('error kub');
		throw error;
	}
});

try {
    client.login(token);
} catch (error) {
	console.error('Can\'t login with this token / token missing');
    throw error;
}