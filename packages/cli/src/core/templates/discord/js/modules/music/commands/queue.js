export default {
    name: 'queue',
    description: 'Display the current music queue',
    execute: async (client, interaction) => {
        const response = '📜 The music queue is currently empty.';
        if (interaction.reply) await interaction.reply(response);
        else interaction.channel.send(response);
    }
};
