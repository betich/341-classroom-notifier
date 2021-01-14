const sheetsapi 	=	require('./helper/sheetsapi.js');
const time			=	require('./helper/time.js');
const Discord       =   require('discord.js');
const config		=	require('../config.json');

module.exports = {
	name: 'classestoday',
	aliases: ['listclasses', 'today'],
	description: 'List all classes today',
	uses: 'classestoday [all,a]',
	execute(msg,args) {
		const channel = (args && (args[0] == 'all' || args[0] == 'a')) ? msg.channel : msg.author;
		
		if (time.getDay() >= 0 && time.getDay() <= 4) {
			sheetsapi.callAPI(1, 'A1:L6', (req) => {
				req.removeBreakTime(); // filter data
				let classes = req.data[time.getDay()] // all classes today
				classes.filter((data) => data != null);

				if (classes) {
					var Embed = new Discord.MessageEmbed()
						.setColor(config.embed_color) //Yellow
						.setTitle(`Today\'s Classes`)
						.setDescription(classes.join('\n'))
	
					return channel.send(Embed)
				} else {
					return channel.send('There are no classes today.')
				}
			});
		} else {
			return channel.send('There are no classes today.');
		}
	}
};