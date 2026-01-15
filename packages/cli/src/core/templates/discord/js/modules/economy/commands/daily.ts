export default {
    name: 'daily',
    description: 'Claim your daily reward',
    execute: async (client: any, interaction: any) => {
        const reward = 500;
        const response = `🎁 You claimed your daily reward of **$${reward}**!`;
        
        if (interaction.reply) {
            await interaction.reply(response);
        } else {
            await interaction.channel.send(response);
        }
    }
};
