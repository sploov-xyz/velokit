export default {
    name: 'volume',
    description: 'Adjust the music volume',
    options: [
        {
            name: 'level',
            description: 'Volume level (1-100)',
            type: 4, // INTEGER
            required: true
        }
    ],
    execute: async (client: any, interaction: any, args: string[]) => {
        const level = interaction.options ? interaction.options.getInteger('level') : args[0];
        const response = `🔊 Volume set to ${level}%.`;
        if (interaction.reply) await interaction.reply(response);
        else interaction.channel.send(response);
    }
};
