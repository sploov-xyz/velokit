export default {
    name: 'stop',
    description: 'Stop the music and clear the queue',
    execute: async (client: any, interaction: any) => {
        // Logic for stopping music
        const response = '⏹️ Music stopped and queue cleared.';
        if (interaction.reply) await interaction.reply(response);
        else interaction.channel.send(response);
    }
};
