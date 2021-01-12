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

/*
return new Promise((resolve, reject) => {
    if (!spamChannel) reject(`unknown channel, please run ${prefix}setup`);

    spamChannel.send(time.isInRange(periods.c1, time.changeMinutes(periods.c1, 10)))
    .then(msg => {
        setTimeout(() => {
        process.nextTick(() => {
            if (spamming) {
                notify() // recursion
                .then(resolve) // not entirely necessary, but good practice
                .catch(error => {
                    console.log('error while sending message kub');
                    throw error;
                }); // log error to console in case one shows up
            }
            // otherwise, just resolve promise to end this looping
            else {
                resolve();
            }
        }) // immediately
        }, 1 * 5 * 1000) // remove later
    })
    .catch(error => {
        console.log('error kub');
        throw error;
    });
});
*/

function notify() {
    if (periods.some(elem => time.isInPeriod(elem))) {
        const classindex = periods.findIndex(elem =>  elem == elem/*c current time in string */);
        // get api
        /*
        sheetsapi.getData((data) => {
            console.log(removeBreakTime(data));
            day = time.getDay();
    
            if (data[day][classindex]) {
                
                setTimeout(notify, 1 * 60 * 1000);
            } 
            else {
                setTimeout(notify, 1 * 1000);
            }
        }
    });
    */
    }
       else {
           setTimeout(notify, 1 * 1000);
       }

        // get day
}

// public functions that will be used in your index.js file
module.exports = {
    // pass in discord.js channel for spam function
    setChannel: (channel) => {
        notifyChannel = channel;
    },
    getChannel: () => notifyChannel
}