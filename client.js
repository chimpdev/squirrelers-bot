import Discord from 'discord.js';
import logger from './utils/logger.js';
import dropCommand from './commands/drop.js';
import squeakCommand from './commands/squeak.js';
import pingCommand from './commands/ping.js';
import helpCommand from './commands/help.js';

export default function () {
  global.commands = new Discord.Collection();

  commands.set(dropCommand.data.name, dropCommand);
  commands.set(squeakCommand.data.name, squeakCommand);
  commands.set(pingCommand.data.name, pingCommand);
  commands.set(helpCommand.data.name, helpCommand);

  const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

  client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`);

    if (process.argv.includes('--register-commands')) {
      const rest = new Discord.REST().setToken(process.env.BOT_TOKEN);

      logger.info('Registering slash commands');
      rest.put(Discord.Routes.applicationCommands(client.user.id), { body: commands.map(command => command.data) }).then(() => {
        logger.info('Successfully registered slash commands');
      }).catch(err => logger.error(err));
    }
  });

  const cooldowns = new Discord.Collection();

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (!commands.has(interaction.commandName)) return;

    const command = commands.get(interaction.commandName);
    logger.info(`Received command ${command.data.name} from ${interaction.user.tag} (${interaction.client.ws.ping} ms)`);

    if (command.cooldown) {
      if (!cooldowns.get(command.data.name)) cooldowns.set(command.data.name, new Discord.Collection());
      if ((cooldowns.get(command.data.name).get(interaction.user.id) || Date.now()) > Date.now()) return interaction.reply({ content: `You're on cooldown! Please wait **${((cooldowns.get(command.data.name).get(interaction.user.id) - Date.now()) / 1000).toFixed(2)}** seconds.`, ephemeral: true });

      cooldowns.get(command.data.name).set(interaction.user.id, Date.now() + (command.cooldown * 1000));
    };

    try {
      return command.execute(interaction);
    } catch (error) {
      logger.error('There was an error executing the command');
      logger.error(error.stack);
      return interaction.reply({ content: 'There was an error executing the command.', ephemeral: true });
    };
  });

  client.login(process.env.BOT_TOKEN).catch(err => logger.error(err));
  global.client = client;
}