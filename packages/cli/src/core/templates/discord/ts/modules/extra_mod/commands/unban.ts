export default {
    name: 'unban',
    description: 'Unban a user by ID',
    userPermissions: ['BanMembers'],
    execute: async (client: any, message: any, args: string[]) => {
        const userId = args[0];
        if (!userId) return message.reply('Provide a user ID.');
        
        await message.guild.members.unban(userId);
        message.reply(`User ${userId} unbanned.`);
    }
};
