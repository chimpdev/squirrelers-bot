import Discord from 'discord.js';
import logger from './utils/logger.js';
import dropCommand from './commands/drop.js';
import squeakCommand from './commands/squeak.js';
import pingCommand from './commands/ping.js';

export default function () {
  const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

  client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`);

    if (process.argv.includes('--register-commands')) {
      const rest = new Discord.REST().setToken(process.env.BOT_TOKEN);

      logger.info('Registering slash commands');
      rest.put(Discord.Routes.applicationCommands(client.user.id), { body: [squeakCommand.data, dropCommand.data, pingCommand.data] }).then(() => {
        logger.info('Successfully registered slash commands');
      }).catch(err => logger.error(err));
    }
  });

  const cooldowns = new Discord.Collection();

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;
    logger.info(`Received command ${command} from ${interaction.user.tag} (${interaction.client.ws.ping} ms)`);

    if (command === 'squeak') {
      if ((cooldowns.get(interaction.user.id) || Date.now()) > Date.now()) return interaction.reply({ content: `You're on cooldown! Please wait **${((cooldowns.get(interaction.user.id) - Date.now()) / 1000).toFixed(2)}** seconds.`, ephemeral: true });

      cooldowns.set(interaction.user.id, Date.now() + (squeakCommand.cooldown * 1000));
      return squeakCommand.execute(interaction);
    };
    if (command === 'drop') return dropCommand.execute(interaction);
    if (command === 'ping') return pingCommand.execute(interaction);
  });

  client.login(process.env.BOT_TOKEN).catch(err => logger.error(err));
  global.client = client;
}