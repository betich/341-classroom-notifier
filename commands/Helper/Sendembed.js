const Discord = require('discord.js');

/*
    Recommendation Settings
    Title: 'Online Classroom'
    Description: Teacher name
    Author Pic: Teacher pic (LOL?)
    Author Name: Teacher name
    URL: Zoom / Google meet link
    Thumbnail: ** Need Recommendation **
    Line 1:
        Class, Time, Self-Naming
    Line 2:
        Next classname, Next classtime
*/

module.exports = {
    sendembed (message) {
        const embed = new Discord.MessageEmbed()
            .setColor('#fcfc03') //Yellow
            .setTitle('Online Classroom')
            .setURL('https://github.com/betich/341-classroom-notifier')
            .setAuthor('Porawat Poothum')
            .addFields(
                {name: 'Class', value: 'Math'},
                {name: 'Time', value: '14.10 - 15.00', inline: true}
            );
            message.channel.send(embed);
    }
};