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
	name: 'nextclass',
	aliases: ['next', 'n'],
	description: 'Returns the next class',
    uses: 'nextclass [dm, d, pm]',
	execute(msg, args) {
        const channel = (args && (args[0] == 'dm' || args[0] == 'd' || args[0] == 'pm')) ? msg.author : msg.channel;
        if (channel === msg.author) {
            react(msg);
        }
        
        exec(channel);
    }
};

async function Embed(startTime, subject, channel) {
    let endTime = time.changeMinutes(startTime, 50);
    req = await sheetsapi.callAPI(2, 'A2:H20');
    req.arrayToObject();
    const data = req.body;

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
}

async function exec (channel, classIndex) {
    req = await sheetsapi.callAPI(1, 'A1:L6');
    req.removeBreakTime(); // filter data
    const [Startday, Startindex] = getNextClass();
    let found = false;

    for (let day = Startday ; day < 5 && !found ; day++) {
        for ( let classIndex = Startindex ; classIndex < 8 && !found; classIndex++) {
            if (req.body[day][classIndex]) {
                found = true;
                const currentclass = req.body[day][classIndex] // all classes today
                if (currentclass) {
                    await Embed(periods[classIndex], currentclass, channel);
                }
            }
        }
    }

    for (let day = 0 ; day < Startday && !found ; day++) {
        for ( let classIndex = 0 ; classIndex < Startindex && !found; classIndex++) {
            if (req.body[day][classIndex]) {
                found = true;
                const currentclass = req.body[day][classIndex] // all classes today
                if (currentclass) {
                    await Embed(periods[classIndex], currentclass, channel);
                }
            }
        }
    }
    if (!found) {
        channel.send('No class found');
    }
}

getNextClass = () => {
    // class over
    if (time.isInRange(periods[7],"00:00")) {
        return [day, 0];
    }

    // before class
    if (time.isInRange("00:00",periods[0])) {
        let day = time.getDay();
        day = day > 4 ? 0 : day;
        return [time.getDay(), 0];
    }
    return [time.getDay() > 4 ? 0 : time.getDay(), periods.findIndex(elem => time.isInRange(elem, time.changeMinutes(elem, 50))) + 1] ;
};

async function react(msg) {
    try {
        await msg.react('772162743821664276');
    } catch {
        await msg.react('🤩');
    }
}