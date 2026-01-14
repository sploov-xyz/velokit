export default {
    name: 'eval',
    description: 'Execute JavaScript code (Owner Only)',
    execute: async (client: any, message: any, args: string[]) => {
        // Simple owner check (add your ID to .env)
        const ownerId = process.env.OWNER_ID;
        if (message.author.id !== ownerId) return message.reply('Only the bot owner can use this command.');

        const code = args.join(' ');
        try {
            const result = eval(code);
            message.reply(`\
\
${result}
\
\
`);
        } catch (error) {
            message.reply(`\
\
${error}
\
\
`);
        }
    }
};
