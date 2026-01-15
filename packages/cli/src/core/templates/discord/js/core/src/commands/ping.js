export default {
    name: 'ping',
    description: 'Check bot latency',
    cooldown: 5,
    userPermissions: [],
    botPermissions: ['SendMessages'],
    execute: async (client, interaction) => {
        const response = `Pong! ${client.ws.ping}ms`;
        
        if (interaction.reply) {
            await interaction.reply(response);
        } else {
            await interaction.channel.send(response);
        }
    }
};
