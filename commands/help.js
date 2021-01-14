const config    =   require('../config.json');
const Discord   =   require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    uses: 'help setup',
    execute(msg, args) {
        const { commands } = msg.client;
        
        if (!args.length) {
            let data = [];
            commands.forEach((command) => {
                data.push(command.name);
            });

            let commandsList = data.map((data) => `\`${data}\``);

            var Embed = new Discord.MessageEmbed()
                .setColor(config.embed_color) //Yellow
                .setTitle(`Commands List`)
                .setDescription(commandsList.join(', '))
                .setFooter(`You can send \`${config.prefix}help [command name]\` to get info on a specific command!`)

            return msg.channel.send(Embed)
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
            const aliases = command.aliases.map((alias) => `\`${alias}\``).join(', ');
            if (!command) return msg.reply('that\'s not a valid command!');

            const info = [
                {name: 'Aliases', value: aliases},
                {name: 'Uses', value: `\`${config.prefix + command.uses}\``}
            ];

            var Embed = new Discord.MessageEmbed()
                .setColor(config.embed_color) //Yellow
                .setTitle(`\`${config.prefix + command.name}\``)
                .addFields(...info)
                .setDescription(command.description)
                .setFooter(`You can send \`${config.prefix}help\` to get a list of every available commands`)

            return msg.channel.send(Embed)
        }

    },
};