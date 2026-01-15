import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadEvents(client) {
    const eventsPath = path.join(__dirname, '../events');
    if (!fs.existsSync(eventsPath)) return;

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = await import(`file://${path.join(eventsPath, file)}`);
        const eventName = file.split('.')[0];
        
        if (event.default) {
            client.on(eventName, event.default.bind(null, client));
        }
    }

    Logger.success(`Loaded ${eventFiles.length} events.`);
}
