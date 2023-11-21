import Discord from 'discord.js';

export default {
  data: {
    name: 'help',
    description: 'Get help with the bot.'
  },
  cooldown: 5,
  execute: async interaction => {
    await interaction.deferReply();

    const embed = new Discord.EmbedBuilder()
      .setColor('Random')
      .setAuthor({ name: 'Help', iconURL: client.user.displayAvatarURL() })
      .setFooter({ text: 'Requested by ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp(new Date())
      .setDescription(`Currently there are ${commands.size} commands registered.`);

    const fetchedCommands = await client.application.commands.fetch();
    embed.setFields(fetchedCommands.reduce((fields, command) => {
      if (command.options.length > 0 && command.options.some(option => option.type === 1)) {
        command.options.filter(option => option.type === 1).forEach(option => {
          fields.push({
            name: `</${command.name} ${option.name}:${command.id}>`,
            value: `- ${option.description}`
          });
        });
      } else {
        fields.push({
          name: `</${command.name}:${command.id}>`,
          value: `- ${command.description}`
        });
      };

      return fields;
    }, []));

    return interaction.followUp({ embeds: [embed] });
  }
}