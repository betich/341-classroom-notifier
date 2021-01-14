const time              =   require('./time.js');
const { OnlineClass }   =   require('../../onlineclass/onlineClass.js');
const sheetsapi         =   require('./sheetsapi.js');

let notifyChannel = undefined;

var x = 0;

const periods = [
    "05:40",
    "08:40",
    "09:40",
    "10:30",
    "12:20",
    "13:10",
    "14:10",
    "15:00"
];

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const notify = async () => {
    let classIndex = periods.findIndex((period) => time.isInPeriod(period));
    if (time.getDay() >= 0 && time.getDay() <= 4) {
        if (classIndex !== -1) {
        // Find if a period is happening now
            console.log(`${periods[classIndex]}, class ${classIndex+1} of ${days[time.getDay()]}`);
            req = await sheetsapi.callAPI(1, 'A1:L6');
            req.removeBreakTime(); // filter data
            let currentPeriod = req.body[time.getDay()][classIndex]; // current class
            
            if (currentPeriod !== '') {
                console.log('imhere');
                await Embed(periods[classIndex], currentPeriod, notifyChannel);
                return setTimeout(notify, 2 * 60 * 1000);
            }
        }
    }
    console.log(`${x++} passed`);
    return setTimeout(notify, 2 * 1000);
}


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


// public functions that will be used in your index.js file
module.exports = {
    // pass in discord.js channel for spam function
    setChannel: (channel) => {
        notifyChannel = channel;
    },
    getChannel: () => notifyChannel || undefined,
    notify: notify
}