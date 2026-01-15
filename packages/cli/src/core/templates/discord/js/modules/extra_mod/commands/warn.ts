export default {
    name: 'warn',
    description: 'Warn a member',
    userPermissions: ['ModerateMembers'],
    execute: async (client: any, message: any, args: string[]) => {
        const target = message.mentions.members.first();
        if (!target) return message.reply('Mention a user to warn.');
        
        message.reply(`${target.user.tag} has been warned.`);
    }
};
