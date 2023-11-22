import Discord from 'discord.js'
import Drop from '../schemas/Drop.js';

export default {
  data: new Discord.SlashCommandBuilder()
    .setName('drop')
    .setDescription('Manage the squirrel picture dropping.')
    .addSubcommand(subcommand => subcommand.setName('set').setDescription('Set the channel to drop squirrel pictures in.')
      .addChannelOption(option => option.setName('channel').setDescription('The channel to drop squirrel pictures in.').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('stop').setDescription('Stop dropping squirrel pictures.'))
    .setDMPermission(false)
    .toJSON(),
  execute: async interaction => {
    if (!interaction.member.permissions.has('ManageGuild')) return interaction.reply({ content: 'You need the Manage Server permission to use this command.', ephemeral: true });

    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'set') {
      try {
        const channel = interaction.options.getChannel('channel');
        if (![Discord.ChannelType.GuildAnnouncement, Discord.ChannelType.GuildText].includes(channel.type)) return interaction.followUp('I can only drop squirrel pictures in text channels.');

        await Drop.findOneAndUpdate({ _id: interaction.guild.id }, { channel: channel.id }, { upsert: true });
        return interaction.followUp(`I'll drop squirrel pictures in ${channel} every 1 hour.`);
      } catch (error) {
        logger.error('There was an error trying to set the channel D:');
        logger.error(error.stack);
        return interaction.followUp('There was an error trying to set the channel D:');
      }
    };

    if (subcommand === 'stop') {
      const data = await Drop.findOne({ _id: interaction.guild.id });
      if (!data) return interaction.followUp('I\'m not dropping squirrel pictures in this server.');

      await Drop.deleteOne({ _id: interaction.guild.id });
      return interaction.followUp('I\'ll stop dropping squirrel pictures.');
    };
  }
}