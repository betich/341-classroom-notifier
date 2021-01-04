module.exports = {
	name: 'ping',
	aliases: ['hello'],
	description: 'Ping!',
	execute(msg) {
		msg.channel.send('Pong.');
	}
};