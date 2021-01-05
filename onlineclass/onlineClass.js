const Discord = require('discord.js');

const thumbnails = ['https://img.pokemondb.net/artwork/large/mudkip.jpg','https://img.pokemondb.net/artwork/large/turtwig.jpg','https://img.pokemondb.net/artwork/large/oshawott.jpg']

class onlineClass {
    constructor ({index, startTime, endTime, subject, teacher, meeting}) {
        this.index = index;
        this.startTime = startTime;
        this.endTime = endTime;
        this.subject = subject;
        this.teacher = teacher;
        this.meeting = meeting; 
        /*   Example
        meeting1 = {
            "type": "link",
            "value": "zoom.us/fdofjkdofd"
        }
        meeting2 = {
            "type": "id"
            "value": {
                "site": "zoom.us"
                "id": "123456",
                "password": "78910"
            }
        }*/
    }

    get detail () {
        return `Index: ${this.index}\nStart ${this.startTime}\nEnd ${this.endTime}\nSubject: ${this.subject}\nTeacher: ${this.teacher}\n$Meeting: ${JSON.stringify(meeting)}`;
    }

    sendEmbed (channel) {
        const embed = new Discord.MessageEmbed()
            .setColor('#fcfc03') //Yellow
            .setTitle('Online Classroom')
            .setAuthor(this.teacher)
            .setThumbnail(thumbnails[Math.floor(Math.random() * thumbnails.length)])
            .addFields(
                {name: 'Class', value: this.subject},
                {name: 'Time', value: `${this.startTime} - ${this.endTime}`},
                {name: 'ID', value: this.meeting.type === 'link' ? '-' : this.meeting.value.id, inline: true},
            )
            .addField('Passcode', this.meeting.type === 'link' ? '-' : this.meeting.value.password, true)
            .setTimestamp()
            .setURL(this.meeting.type == 'link' ? this.meeting.value : this.meeting.value.site);

        channel.send(embed);
    }
};

module.exports = onlineClass;