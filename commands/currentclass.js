const time = require('./helper/time.js')
const sheetsapi = require('./helper/sheetsapi.js');
const { OnlineClass } = require('../onlineclass/onlineClass.js');

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

		if (time.getDay() >= 0 && time.getDay() <= 4) {
            const classIndex = periods.findIndex(elem => time.isInRange(elem, time.changeMinutes(elem, 50)));

            if ( classIndex === -1) {
                return channel.send('There are no classes now');
            } else {
                sheetsapi.callAPI(1, 'A1:L6', (req) => {
                    req.removeBreakTime(); // filter data
                    const currentclass = req.data[time.getDay()][classIndex] // all classes today
                    if (currentclass) {
                        Embed(periods[classIndex], currentclass, channel);
                    } else {
                        return channel.send('There are no classes now')
                    }
                });
            }
		} else {
			return channel.send('There are no classes today.');
		}
	}
};

function Embed(startTime, subject, channel) {
    let endTime = time.changeMinutes(startTime, 50);
    sheetsapi.callAPI(2, 'A2:H20', (req) => {
        req.arrayToObject();
        const data = req.data;

        let subjectData = data[data.findIndex((subData) => subData.subject === subject)];
        let teacher = subjectData.teacher;
        let meeting = {
            "site": subjectData.link,
            "id": subjectData.username,
            "password": subjectData.password
        }
        let classId = subjectData.id;
        let note = subjectData.note;
    
        let newEmbed = new OnlineClass(startTime, endTime, subject, teacher, meeting, note, classId);
        newEmbed.sendEmbed(channel);
    });
}