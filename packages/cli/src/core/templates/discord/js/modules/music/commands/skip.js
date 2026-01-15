export default {
    name: 'skip',
    description: 'Skip the current song',
    execute: async (client, interaction) => {
        const response = '⏭️ Song skipped.';
        if (interaction.reply) await interaction.reply(response);
        else interaction.channel.send(response);
    }
};
