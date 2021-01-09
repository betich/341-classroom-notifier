const prefix = require('../../config.json').prefix;
const time = require('./time');
let spamming = false;
let spamChannel = require('../../config.json').default_channel || undefined;
console.log(spamChannel);

const periods = {
    "c1": "07:50",
    "c2": "08:40",
    "c3": "09:40",
    "c4": "10:30",
    "c5": "12:20",
    "c6": "13:10",
    "c7": "14:10",
    "c8": "15:00"
};

function notify() {
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
}

// public functions that will be used in your index.js file
module.exports = {
    // pass in discord.js channel for spam function
    setChannel: (channel) => {
        spamChannel = channel;
    },

    // set spam status (true = start spamming, false = stop spamming)
    setStatus: (spamStatus) => {
        // get current status
        let currentStatus = spamming;

        // update spamming flag
        spamming = spamStatus;
        // if spamming should start, and it hasn't started already, call spam()
        if (spamStatus && currentStatus != spamStatus) {
            notify();
        }            
    },

    getStatus: () => spamming,
    getChannel: () => spamChannel
};