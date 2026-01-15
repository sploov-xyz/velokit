export default {
    name: 'play',
    description: 'Play a song',
    execute: async (client, message, args) => {
        if (!message.member.voice.channel) return message.reply('You need to be in a voice channel!');
        const query = args.join(' ');
        if (!query) return message.reply('Please provide a song name or URL.');
        
        message.reply(`Searching for \n${query}\n and playing...`);
        // Lavalink/Riffy logic would go here
    }
};
