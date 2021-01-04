const prefix = require('../../config.json').prefix;
let spamming = false;
let spamChannel = undefined;

// spam function repeats until variable spamming is false
function spam() {
    return new Promise((resolve, reject) => {
        // add check to make sure discord channel exists
        if (!spamChannel) reject('unknown channel, please run ' + prefix + 'setup');

        spamChannel.send('spam1')
        .then(msg => {
            setTimeout(() => {
                if (spamming) {
                    spam()
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
            }, 1 * 3 * 1000) // 3 seconds
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
            spam();
        }
    },

    // not used in my commands, but you may find this useful somewhere
    getStatus: () => spamming
};