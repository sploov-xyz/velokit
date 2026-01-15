export default {
    name: 'queue',
    description: 'Display the current music queue',
    execute: async (client: any, interaction: any) => {
        const response = '📜 The music queue is currently empty.';
        if (interaction.reply) await interaction.reply(response);
        else interaction.channel.send(response);
    }
};
