export default {
    name: 'skip',
    description: 'Skip the current song',
    execute: async (client: any, interaction: any) => {
        const response = '⏭️ Song skipped.';
        if (interaction.reply) await interaction.reply(response);
        else interaction.channel.send(response);
    }
};
