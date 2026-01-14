export default {
    name: 'play',
    description: 'Play a song',
    execute: async (client: any, message: any, args: string[]) => {
        if (!message.member.voice.channel) return message.reply('You need to be in a voice channel!');
        const query = args.join(' ');
        if (!query) return message.reply('Please provide a song name or URL.');
        
        message.reply(`Searching for 
${query}
 and playing...`);
        // Lavalink/Riffy logic would go here
    }
};
