import { REST, Routes } from 'discord.js';
import { SploovClient } from '../index';
import { Logger } from '../utils/logger';

export async function registerCommands(client: SploovClient) {
    const commands = Array.from(client.commands.values()).map(cmd => ({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options || []
    }));

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    try {
        Logger.info(`Started refreshing ${commands.length} application (/) commands.`);

        const data: any = await rest.put(
            Routes.applicationCommands(client.user!.id),
            { body: commands },
        );

        Logger.success(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        Logger.error('Failed to register application commands:', error);
    }
}
