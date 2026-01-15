import { SploovClient } from '../index';
import { Logger } from '../utils/logger';
import { registerCommands } from '../handlers/registerCommands';

export default async (client: SploovClient) => {
    Logger.success(`Logged in as ${client.user?.tag}!`);
    await registerCommands(client);
};
