export default {
    name: 'ban',
    description: 'Ban a member',
    userPermissions: ['BanMembers'],
    execute: async (client: any, message: any, args: string[]) => {
        const target = message.mentions.members.first();
        if (!target) return message.reply('Mention a user to ban.');
        
        await target.ban();
        message.reply(`${target.user.tag} banned.`);
    }
};
