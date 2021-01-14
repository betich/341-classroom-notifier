const time              =   require('./time.js');
const { OnlineClass }   =   require('../../onlineclass/onlineClass.js');
const sheetsapi         =   require('./sheetsapi.js');

let notifyChannel = undefined;

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

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const notify = async () => {
    if (time.getDay() >= 0 && time.getDay() <= 4) {
        // Find if a period is happening now
        let classIndex = periods.findIndex((period) => time.isInPeriod(period));
        if (classIndex !== -1) {
            console.log(`${periods[classIndex]}, class ${classIndex+1} of ${days[time.getDay()]}`);
            sheetsapi.callAPI(1, 'A1:L6', (req) => {
                req.removeBreakTime(); // filter data
                let currentPeriod = req.data[time.getDay()][classIndex]; // current class
                
                if (currentPeriod !== '') {
                    Embed(periods[classIndex], currentPeriod);
                }c
            });
            await new Promise((resolve, reject) => setTimeout(resolve, 2 * 60 * 1000)); // 2 minute timeout
        }
    }
}

function Embed(startTime, subject) {
    let endTime = time.changeMinutes(startTime, 50);
    sheetsapi.callAPI(2, 'A2:H20', (req) => {
        req.arrayToObject();
        data = req.data;
        console.log(data);
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
        newEmbed.sendEmbed(notifyChannel);
    });
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