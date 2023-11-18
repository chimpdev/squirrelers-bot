import { CronJob } from 'cron';
import Discord from 'discord.js';
import dotenv from 'dotenv';
import { Database } from 'quickmongo';
import logger from './utils/logger.js';
import random_squirrel_buffer from './utils/random_squirrel_buffer.js';
import startClient from './client.js';

dotenv.config();
global.logger = logger;

startClient()

const database = new Database(process.env.MONGO_URI);
database.connect().then(() => {
  logger.info('Connected to database');
  global.database = database;
}).catch(err => logger.error(err));

new CronJob('0 * * * *', async () => {
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  try {
    const buffer = await random_squirrel_buffer();
    const attachment = new Discord.AttachmentBuilder(buffer, { name: 'squirrel.jpeg' });

    const channels = await database.get('drop-squirrel') || {};
    await Promise.all(Object.keys(channels).map(async guildId => {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return;

      const channelId = channels[guildId];
      const channel = guild.channels.cache.get(channelId);
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