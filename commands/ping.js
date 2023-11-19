export default {
  data: {
    name: 'ping',
    description: 'Calculate how long it takes for the bot to respond.'
  },
  execute: async interaction => {
    const sent = await interaction.reply({ content: 'Calculating...', fetchReply: true });
    const time = sent.createdTimestamp - interaction.createdTimestamp;
    return interaction.editReply(`Pong! Took ${time} ms. Server latency is ${interaction.client.ws.ping} ms.`);
  }
}