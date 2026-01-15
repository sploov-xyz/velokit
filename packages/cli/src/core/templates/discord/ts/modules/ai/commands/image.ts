export default {
    name: 'image',
    description: 'Generate an image using AI',
    execute: async (client: any, message: any, args: string[]) => {
        const prompt = args.join(' ');
        if (!prompt) return message.reply('Please provide a prompt for the image.');

        message.channel.sendTyping();

        try {
            const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}`;
            message.reply({
                content: `🎨 Generated image for: **${prompt}**`,
                files: [imageUrl]
            });
        } catch (error) {
            console.error(error);
            message.reply('Failed to generate image.');
        }
    }
};
