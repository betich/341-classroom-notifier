const notify = require('./helper/notify.js');
const time = require('./helper/time.js')
const sheetsapi = require('./helper/sheetsapi.js');
const { OnlineClass } = require('../onlineclass/onlineClass.js');

const periods = [
    ["07:50","08:40"],
    ["08:40","09:30"],
    ["09:40","10:30"],
    ["10:30","11:20"],
    ["12:20","13:10"],
    ["13:10","14:00"],
    ["14:10","15:00"],
    ["15:00","15:50"]
];

module.exports = {
	name: 'currentclass',
	aliases: ['now', 'current'],
	description: 'List this class',
	uses: 'currentclass',
	execute(msg) {
		if (time.getDay() >= 0 && time.getDay() <= 4) {
            const classIndex = periods.findIndex(elem => time.isInRange(elem[0],elem[1]));
            if ( classIndex === -1) {
                msg.channel.send('No class now');
            } else {
                sheetsapi.callAPI(1, 'A1:L6', (req) => {
                    req.removeBreakTime(); // filter data
                    const currentclass = req.data[time.getDay()][classIndex] // all classes today
                    if (currentclass) {
                        Embed(periods[classIndex][0], currentclass, msg.channel);
                    } else {
                        return msg.reply('There are no classes today.')
                    }
                });
            }
		} else {
			return msg.reply('There are no classes today.');
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