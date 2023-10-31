import { CronJob } from 'cron';
import Discord from 'discord.js';
import dotenv from 'dotenv';
import { Database } from "quickmongo";
import dropCommand from './commands/drop.js';
import squeakCommand from './commands/squeak.js';
import logger from './utils/logger.js';
import random_squirrel_buffer from './utils/random_squirrel_buffer.js';

dotenv.config();
global.logger = logger;

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`);

  if (process.argv.includes('--register-commands')) {
    const rest = new Discord.REST().setToken(process.env.BOT_TOKEN);

    logger.info('Registering slash commands');
    rest.put(Discord.Routes.applicationCommands(client.user.id), { body: [squeakCommand.data, dropCommand.data] }).then(() => {
      logger.info('Successfully registered slash commands');
    }).catch(err => logger.error(err));
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = interaction.commandName;
  logger.info(`Received command ${command} from ${interaction.user.tag}`);

  if (command === 'squeak') return squeakCommand.execute(interaction);
  if (command === 'drop') return dropCommand.execute(interaction);
});

client.login(process.env.BOT_TOKEN).catch(err => logger.error(err));

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
    logger.error(`There was an error trying to drop a squirrel picture: ${error}`);
  }
}, null, true);