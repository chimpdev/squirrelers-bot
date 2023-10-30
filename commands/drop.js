import Discord from 'discord.js'

export default {
  data: new Discord.SlashCommandBuilder()
    .setName('drop')
    .setDescription('I\'ll drop a random squirrel picture every 1 hour.')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to drop squirrel pictures in. Leave blank to disable dropping squirrel pictures.'))
    .toJSON(),
  execute: async interaction => {
    if (database === 'NotReady') return interaction.reply({ content: 'Try again later.' });

    await interaction.deferReply();

    try {
      const channel = interaction.options.getChannel('channel');
      if (!channel) {
        await database.delete(`drop-squirrel.${interaction.guild.id}`);
        return interaction.followUp('I\'ll stop dropping squirrel pictures.');
      } else {
        if (![Discord.ChannelType.GuildAnnouncement, Discord.ChannelType.GuildText].includes(channel.type)) return interaction.followUp('I can only drop squirrel pictures in text channels.');

        await database.set(`drop-squirrel.${interaction.guild.id}`, channel.id);
        return interaction.followUp(`I'll drop squirrel pictures in ${channel} every 1 hour.`);
      }
    } catch (error) {
      logger.error(error);
      return interaction.followUp('There was an error trying to set the channel D:');
    }
  }
}