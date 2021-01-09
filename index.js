const fs 			= 	require('fs');
const Discord 		= 	require('discord.js');
const config 		= 	require('./config.json');
const discordToken	= 	require('./discordtoken.json').token;
const onlineClass 	=	require('./onlineclass/onlineClass.js');
const sheetsapi		=	require('./commands/helper/sheetsapi');
const prefix 		=	config.prefix;

// SHEETS API

// Load client secrets from a local file.

// TODO sheetsapi.authorize returns a value
sheetsapi.authorize('credentials.json', sheetsapi.listData('A:E'));

// DISCORD

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
	let command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
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
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command) return;

	try {
		command.execute(message, args);
	} catch (error) {
		message.reply('error kub');
		throw error;
	}
});

try {
    client.login(discordToken);
} catch (error) {
	console.error('Can\'t login with this token / token missing');
    throw error;
}