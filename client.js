import Discord from 'discord.js';
import logger from './utils/logger.js';
import dropCommand from './commands/drop.js';
import squeakCommand from './commands/squeak.js';

export default function () {
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
  global.client = client;
}