const sheetsapi 	=	require('./helper/sheetsapi.js');
const time			=	require('./helper/time.js');
const Discord       =   require('discord.js');
const config		=	require('../config.json');

module.exports = {
	name: 'classestoday',
	aliases: ['listclasses', 'today'],
	description: 'List all classes today',
	uses: 'classestoday',
	execute(msg) {
		if (time.getDay() >= 0 && time.getDay() <= 4) {
			sheetsapi.callAPI(1, 'A1:L6', (req) => {
				req.data = sheetsapi.removeBreakTime(req.data); // filter data
				let classes = req.data[time.getDay()] // all classes today
				classes.filter((data) => data != null);

				if (classes) {
					var Embed = new Discord.MessageEmbed()
						.setColor(config.embed_color) //Yellow
						.setTitle(`Today\'s Classes`)
						.setDescription(classes.join('\n'))
	
					return msg.channel.send(Embed)
				} else {
					return msg.reply('There are no classes today.')
				}
			});
		} else {
			return msg.reply('There are no classes today.');
		}
	}
};