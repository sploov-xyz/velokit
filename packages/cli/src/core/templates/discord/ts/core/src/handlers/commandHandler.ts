import { SploovClient } from '../index';
import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/logger';

export async function loadCommands(client: SploovClient) {
    const commandsPath = path.join(__dirname, '../commands');
    if (!fs.existsSync(commandsPath)) return;

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = await import(path.join(commandsPath, file));
        if (command.default && command.default.name) {
            client.commands.set(command.default.name, command.default);
        }
    }

    Logger.success(`Loaded ${client.commands.size} commands.`);
}
