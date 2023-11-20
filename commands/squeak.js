import Discord from 'discord.js'
import random_squirrel_buffer from '../utils/random_squirrel_buffer.js';

export default {
  data: {
    name: 'squeak',
    description: 'Squeak!'
  },
  cooldown: 30,
  execute: async interaction => {
    await interaction.deferReply();

    try {
      const buffer = await random_squirrel_buffer();
      const attachment = new Discord.AttachmentBuilder(buffer, { name: 'squirrel.jpeg' });

      return interaction.followUp({ files: [attachment] });
    } catch (error) {
      logger.error(error);
      return interaction.followUp('There was an error trying to fetch a squirrel D:');
    }
  }
}