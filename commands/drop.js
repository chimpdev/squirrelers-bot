import Discord from 'discord.js'

export default {
  data: new Discord.SlashCommandBuilder()
    .setName('drop')
    .setDescription('Manage the squirrel picture dropping.')
    .addSubcommand(subcommand => subcommand.setName('set').setDescription('Set the channel to drop squirrel pictures in.')
      .addChannelOption(option => option.setName('channel').setDescription('The channel to drop squirrel pictures in.').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('stop').setDescription('Stop dropping squirrel pictures.'))
    .toJSON(),
  execute: async interaction => {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case 'set':
        try {
          const channel = interaction.options.getChannel('channel');
          if (![Discord.ChannelType.GuildAnnouncement, Discord.ChannelType.GuildText].includes(channel.type)) return interaction.followUp('I can only drop squirrel pictures in text channels.');

          await database.set(`drop-squirrel.${interaction.guild.id}`, channel.id);
          interaction.followUp(`I'll drop squirrel pictures in ${channel} every 1 hour.`);
          break;
        } catch (error) {
          logger.error(error);
          interaction.followUp('There was an error trying to set the channel D:');
          break;
        };
      case 'stop':
        const channel = await database.get(`drop-squirrel.${interaction.guild.id}`);
        if (!channel) return interaction.followUp('I\'m not dropping squirrel pictures in this server.');

        await database.delete(`drop-squirrel.${interaction.guild.id}`);
        interaction.followUp('I\'ll stop dropping squirrel pictures.');
        break;
    };
  }
}