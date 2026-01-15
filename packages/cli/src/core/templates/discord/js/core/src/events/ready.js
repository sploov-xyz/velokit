import { Logger } from '../utils/logger.js';
import { registerCommands } from '../handlers/registerCommands.js';

export default async (client) => {
    Logger.success(`Logged in as ${client.user?.tag}!`);
    await registerCommands(client);
};
