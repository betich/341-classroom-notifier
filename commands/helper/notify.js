const prefix = require('../../config.json').prefix;
const time = require('./time');
const onlineClass = require('../../OnlineClass/onlineClass');
const sheetsapi = require('./sheetsapi.js');
const { removeBreakTime } = require('./sheetsapi.js');

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
]

const notify = () => {
    if (time.getDay() >= 0 && time.getDay() <= 4) {
        // Find if a period is happening now
        let classIndex = periods.findIndex((period) => time.isInPeriod(period));
        if (classIndex !== -1) {
            sheetsapi.getData('A1:L6', (data) => {
                data = sheetsapi.removeBreakTime(data); // filter data
                let currentPeriod = data[time.getDay()][classIndex]; // current class
                if (currentPeriod !== '') {
                    notifyChannel.send(currentPeriod); // send current period
                }
                console.log(`${periods[classIndex]}, class ${classIndex} of ${days[time.getDay()]}`)
            });
            return setTimeout(notify, 2 * 60 * 1000);
        }
    }

    process.nextTick(notify);
}

// public functions that will be used in your index.js file
module.exports = {
    // pass in discord.js channel for spam function
    setChannel: (channel) => {
        notifyChannel = channel;
    },
    getChannel: () => notifyChannel,
    notify: notify
}