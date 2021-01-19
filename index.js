const fs 			= 	require('fs');
const Discord 		= 	require('discord.js');
const config 		= 	require('./config.json');
const token			= 	require('./token.json').token;
const notify 		=	require('./commands/helper/notify.js');
const prefix 		=	config.prefix;

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
	
	if (config.default_channel) {
		try {
			const channel = client.channels.cache.get(config.default_channel);
			notify.setChannel(channel);
			console.log(`set default channel to #${channel.name}`);
		} catch (e) {
			console.log('Warning: can\'t set notify channels');
			console.log(`try ${prefix}setup on some channel`);
		}
	}
	
	notify.notify();

	console.info("ready!");
});

client.on('message', (message) => {
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
	client.login(token);
} catch (error) {
	console.error('Can\'t login with this token / token missing');
    throw error;
}