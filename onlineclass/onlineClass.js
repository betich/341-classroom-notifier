const Discord       =   require('discord.js');
const fs 			= 	require('fs');

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
        findById(this.classId, thumbnails)
        const thumbnailPath = findById(this.classId, thumbnails);
        const attachment = new Discord.MessageAttachment(`./thumbnails/${thumbnailPath}`, thumbnailPath);
        const embed = new Discord.MessageEmbed()
            .setColor('#fcfc03') //Yellow
            .setTitle('Online Classroom')
            .setAuthor(this.subject)
            .attachFiles(attachment)
            .setImage(`attachment://${thumbnailPath}`)
            .addFields(
                {name: 'Class', value: this.subject},
                {name: 'Time', value: `${this.startTime} - ${this.endTime}`},
                {name: 'ID', value: this.meeting.id, inline: true},
                {name: 'Passcode', value: this.meeting.password, inline: true},
                {name: 'Note', value: this.note}
            )
            .setTimestamp()
            .setURL(this.meeting.site);

        channel.send({embed});
        channel.send("@here");
    }
};

module.exports.OnlineClass = OnlineClass;