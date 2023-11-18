import { CronJob } from 'cron';
import Discord from 'discord.js';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import random_squirrel_buffer from './utils/random_squirrel_buffer.js';
import startClient from './client.js';
import mongoose from 'mongoose';
import Drop from './schemas/Drop.js';

dotenv.config();
global.logger = logger;

startClient();

mongoose.connect(process.env.MONGO_URI).then(() => logger.info('Connected to database')).catch(err => logger.error(err));

new CronJob('0 * * * *', async () => {
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  try {
    const buffer = await random_squirrel_buffer();
    const attachment = new Discord.AttachmentBuilder(buffer, { name: 'squirrel.jpeg' });

    const drops = await Drop.find();
    await Promise.all(drops.map(async data => {
      const guild = client.guilds.cache.get(data._id);
      if (!guild) return;

      const channel = guild.channels.cache.get(data.channel);
      if (!channel) return;

      logger.info(`Dropping squirrel picture in ${channel.guild.name}. (#${channel.name})`);
      channel.send({ content: 'Squeak!', files: [attachment] }).catch(err => logger.error(err));
      await wait(2500);
    }));
  } catch (error) {
    logger.error(`There was an error trying to drop a squirrel picture`);
    logger.error(error.stack);
  }
}, null, true);