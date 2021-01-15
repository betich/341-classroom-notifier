const time = require('./helper/time.js')
const sheetsapi = require('./helper/sheetsapi.js');
const { OnlineClass } = require('../onlineclass/onlineClass.js');
const { Embed } = require('./helper/notify.js');

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
	name: 'currentclass',
	aliases: ['now', 'current'],
	description: 'List this class',
    uses: 'currentclass [all,a]',
	execute(msg, args) {
        const channel = (args && (args[0] == 'all' || args[0] == 'a')) ? msg.channel : msg.author;
        if (channel === msg.author) msg.react('772162743821664276' || '🤩');

		if (time.getDay() >= 0 && time.getDay() <= 4) {
            const classIndex = periods.findIndex(elem => time.isInRange(elem, time.changeMinutes(elem, 50)));

            if ( classIndex === -1) {
                return channel.send('There are no classes now');
            } else {
                // async the api call
                exec(channel, classIndex);
            }
		} else {
			return channel.send('There are no classes today.');
		}
	}
};

async function exec (channel, classIndex) {
    req = await sheetsapi.callAPI(1, 'A1:L6');
    req.removeBreakTime(); // filter data
    const currentclass = req.body[time.getDay()][classIndex] // all classes today
    if (currentclass) {
        await Embed(periods[classIndex], currentclass, channel);
    } else {
        return channel.send('There are no classes now')
    }
}