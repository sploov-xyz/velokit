export default {
    name: 'work',
    description: 'Work for some money',
    execute: async (client: any, interaction: any) => {
        const jobs = ['Pizza Delivery', 'Software Developer', 'Artist', 'Discord Mod'];
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const amount = Math.floor(Math.random() * 200) + 50;
        const response = `👷 You worked as a **${job}** and earned **$${amount}**!`;
        
        if (interaction.reply) {
            await interaction.reply(response);
        } else {
            await interaction.channel.send(response);
        }
    }
};
