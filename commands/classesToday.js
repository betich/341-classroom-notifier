const sheetsapi 	=	require('./helper/sheetsapi.js');
const time			=	require('./helper/time.js');
const Discord       =   require('discord.js');
const config		=	require('../config.json');

const periods = [
    "07:50",
    "08:40",
    "09:40",
    "10:30",
    "12:20",
    "13:10",
    "14:10",
    "15:00"
];

module.exports = {
	name: 'classestoday',
	aliases: ['listclasses', 'today'],
	description: 'List all classes today',
	uses: 'classestoday [dm, d, pm]',
	execute(msg,args) {
		const channel = (args && (args[0] == 'dm' || args[0] == 'd' || args[0] == 'pm')) ? msg.author : msg.channel;
		if (channel === msg.author) msg.react('772162743821664276' || '🤩');
		
		if (time.getDay() >= 0 && time.getDay() <= 4) {
			exec(channel);
		} else {
			return channel.send('There are no classes today.');
		}
	}
};

async function exec(channel) {
	let req1 = await sheetsapi.callAPI(1, 'A1:L6');
	req1.removeBreakTime(); // filter data
	req1 = req1.body[time.getDay()]; // all classes today
	let classes = [];
	
	req1.forEach((subject, idx) => {
		classes.push({ 'time': periods[idx], 'subject': subject })
	});
	
	classes = classes.filter((data) => data.subject != null);

	if (classes) {
		let periods = classes.map((cls) => `${cls.time}: ${cls.subject}`);

		const Embed = new Discord.MessageEmbed()
			.setColor(config.embed_color) //Yellow
			.setTitle(`Today\'s Classes`)
			.setDescription(`\`\`\`yaml\n${periods.join('\n')}\`\`\``)

		return channel.send(Embed)
	} else {
		return channel.send('There are no classes today.')
	}
}