import { Logger } from '../utils/logger.js';

const cooldowns = new Map();

export default async (client, message) => {
    const prefix = '!'; // Can be moved to config
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = client.commands.get(commandName);

    if (!command) return;

    // 1. Permission Check (User)
    if (command.userPermissions) {
        const missing = message.member?.permissions.missing(command.userPermissions);
        if (missing && missing.length > 0) {
            return message.reply(`You need the following permissions: ${missing.join(', ')}`);
        }
    }

    // 2. Permission Check (Bot)
    if (command.botPermissions) {
        const missing = message.guild?.members.me?.permissions.missing(command.botPermissions);
        if (missing && missing.length > 0) {
            return message.reply(`I need the following permissions: ${missing.join(', ')}`);
        }
    }

    // 3. Cooldown Check
    if (command.cooldown) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Map());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \n${command.name}\n command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        await command.execute(client, message, args);
    } catch (error) {
        Logger.error(`Error executing command ${command.name}:`, error);
        message.reply('There was an error trying to execute that command!');
    }
};
