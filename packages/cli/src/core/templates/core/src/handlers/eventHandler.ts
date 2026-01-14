import { SploovClient } from '../index';
import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/logger';

export async function loadEvents(client: SploovClient) {
    const eventsPath = path.join(__dirname, '../events');
    if (!fs.existsSync(eventsPath)) return;

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = await import(path.join(eventsPath, file));
        const eventName = file.split('.')[0];
        
        if (event.default) {
            client.on(eventName, event.default.bind(null, client));
        }
    }

    Logger.success(`Loaded ${eventFiles.length} events.`);
}
