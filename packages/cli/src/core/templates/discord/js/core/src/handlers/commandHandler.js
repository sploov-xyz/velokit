import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands(client) {
    const commandsPath = path.join(__dirname, '../commands');
    if (!fs.existsSync(commandsPath)) return;

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = await import(`file://${path.join(commandsPath, file)}`);
        if (command.default && command.default.name) {
            client.commands.set(command.default.name, command.default);
        }
    }

    Logger.success(`Loaded ${client.commands.size} commands.`);
}
