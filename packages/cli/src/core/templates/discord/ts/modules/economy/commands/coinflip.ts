export default {
    name: 'coinflip',
    description: 'Flip a coin and bet some money',
    execute: async (client: any, interaction: any, args: string[]) => {
        const choice = args[0]?.toLowerCase();
        if (!choice || !['heads', 'tails'].includes(choice)) {
            const msg = 'Usage: `/coinflip <heads|tails>`';
            return interaction.reply ? interaction.reply(msg) : interaction.channel.send(msg);
        }

        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const win = choice === result;
        const response = `🪙 The coin landed on **${result}**! ${win ? 'You won!' : 'You lost!'}`;
        
        if (interaction.reply) {
            await interaction.reply(response);
        } else {
            await interaction.channel.send(response);
        }
    }
};
