export default {
    name: 'balance',
    description: 'Check your current balance',
    execute: async (client: any, interaction: any) => {
        const balance = Math.floor(Math.random() * 1000); // Placeholder
        const response = `💰 Your current balance is **$${balance}**`;
        
        if (interaction.reply) {
            await interaction.reply(response);
        } else {
            await interaction.channel.send(response);
        }
    }
};
