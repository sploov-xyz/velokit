export default {
    name: 'kick',
    description: 'Kick a member',
    execute: async (client: any, message: any, args: string[]) => {
        if (!message.member.permissions.has('KickMembers')) return message.reply('You do not have permission.');
        const target = message.mentions.members.first();
        if (!target) return message.reply('Please mention a user to kick.');
        
        await target.kick();
        message.reply(`${target.user.tag} has been kicked.`);
    }
};
