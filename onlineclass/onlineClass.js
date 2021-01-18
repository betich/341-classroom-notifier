const Discord       =   require('discord.js');
const fs 			= 	require('fs');
const config        =   require('../config.json');

function getThumbnails(dir_path) {
    let thumbnails = [];
    fs.readdirSync(dir_path).forEach(file => {
        thumbnails.push(file);
    });
    return thumbnails
}

function findById(id, paths) {
    let pathIdx = paths.findIndex((path) => {
        return id === (path.substr(0, path.lastIndexOf('.')) || path) // remove file extension
    });
    if (pathIdx !== -1) return paths[pathIdx]
    else return 'default.jpg'
}

const thumbnails = getThumbnails('./thumbnails');

class OnlineClass {
    constructor (startTime, endTime, subject, teacher, meeting=Object, note, classId) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.subject = subject;
        this.teacher = teacher;
        this.meeting = meeting;
        this.note = note;
        this.classId = classId;
        
        this.sendEmbed = this.sendEmbed.bind(this);
    }

    get detail () {
        return `Start ${this.startTime}\nEnd ${this.endTime}\nSubject: ${this.subject}\nTeacher: ${this.teacher}\n$Meeting: ${JSON.stringify(meeting)}`;
    }

    sendEmbed (channel) {
        const thumbnailPath = findById(this.classId, thumbnails);
        const attachment = new Discord.MessageAttachment(`./thumbnails/${thumbnailPath}`, thumbnailPath);
        const embed = new Discord.MessageEmbed()
            .setColor(config.embed_color)
            .setTitle('Online Classroom')
            .setAuthor(this.teacher)
            .attachFiles(attachment)
            .setImage(`attachment://${thumbnailPath}`)
            .addFields(
                {name: 'Class', value: this.subject, inline: true},
                {name: 'Time', value: `${this.startTime} - ${this.endTime}`, inline: true},
                {name: 'Meeting Link', value: `${this.meeting.site}`}
            ).addFields(
                {name: 'ID', value: this.meeting.id, inline: true},
                {name: 'Passcode', value: this.meeting.password, inline: true},
                {name: 'Note', value: this.note}
            )
            .setTimestamp()
            .setURL(this.meeting.site);
        
        channel.send({embed});
    }
};

module.exports.OnlineClass = OnlineClass;