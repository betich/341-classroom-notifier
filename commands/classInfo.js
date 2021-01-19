const config = require('../config.json');
const sheetsapi = require('./helper/sheetsapi.js');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'classinfo',
	aliases: ['info', 'class', 'description'],
	description: 'Provide information for the class',
    uses: 'classinfo [subject] [dm, d, pm]',
	execute(msg, args) {
        const subjectQuery = args[0];
        const channel = (args && (args[1] == 'dm' || args[1] == 'd' || args[1] == 'pm')) ? msg.author : msg.channel;
        if (channel === msg.author) react(msg);

        if (!subjectQuery) return cmdInfo(msg, subjectQuery);
        exec(channel, subjectQuery);
    }
};

async function exec (channel, subjectQuery) {
    const thumbnails = getThumbnails('./thumbnails');
    let req = await sheetsapi.callAPI(2, 'A2:H20');
    req.arrayToObject();
    const data = req.body.filter((Class) => Class.subject !== undefined);

    const subject = data[data.findIndex((Class) => Class.subject.toLowerCase().includes(subjectQuery))];

    if (subject) {
        let subjectName = subject.subject;
        let teacher = subject.teacher;
        let meeting = {
            "site": subject.link,
            "id": subject.username,
            "password": subject.password
        }
        let classId = subject.id;
        let note = subject.note;

        const thumbnailPath = findById(classId, thumbnails);
        const attachment = new Discord.MessageAttachment(`./thumbnails/${thumbnailPath}`, thumbnailPath);
        const embed = new Discord.MessageEmbed()
            .setColor(config.embed_color)
            .setTitle(subjectName)
            .setAuthor(teacher)
            .attachFiles(attachment)
            .setImage(`attachment://${thumbnailPath}`)
            .addFields(
                {name: 'Meeting Link', value: `${meeting.site}`},
                {name: 'ID', value: meeting.id, inline: true},
                {name: 'Passcode', value: meeting.password, inline: true},
                {name: 'Note', value: note}
            )
            .setURL(meeting.site);
            
        channel.send({embed});
    } else {
        channel.send("Can\'t find the subject you\'re looking for")
    }
}

function cmdInfo (msg) {
    const { commands } = msg.client;

    const name = 'classinfo';
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
    const aliases = command.aliases.map((alias) => `\`${alias}\``).join(', ');

    const info = [
        {name: 'Aliases', value: aliases},
        {name: 'Uses', value: `\`${config.prefix + command.uses}\``}
    ];

    var Embed = new Discord.MessageEmbed()
        .setColor(config.embed_color) //Yellow
        .setTitle(`\`${command.name}\``)
        .addFields(...info)
        .setDescription(command.description)
        .setFooter(`You can send \`${config.prefix}help\` to get a list of every available commands`)

    return msg.channel.send(Embed)
}

function findById(id, paths) {
    let pathIdx = paths.findIndex((path) => {
        return id === (path.substr(0, path.lastIndexOf('.')) || path) // remove file extension
    });
    if (pathIdx !== -1) return paths[pathIdx]
    else return 'default.jpg'
}

function getThumbnails(dir_path) {
    let thumbnails = [];
    fs.readdirSync(dir_path).forEach(file => {
        thumbnails.push(file);
    });
    return thumbnails
}

async function react(msg) {
    try {
        await msg.react('772162743821664276');
    } catch {
        await msg.react('🤩');
    }
}