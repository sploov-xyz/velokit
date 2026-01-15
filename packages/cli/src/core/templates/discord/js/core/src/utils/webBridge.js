import express from 'express';
import { Logger } from '../utils/logger.js';

export function startWebBridge(client) {
    const app = express();
    const port = process.env.PORT || 3000;

    app.get('/', (req, res) => {
        res.json({
            status: 'online',
            bot: client.user?.tag,
            guilds: client.guilds.cache.size,
            uptime: client.uptime
        });
    });

    app.listen(port, () => {
        Logger.success(`Web Bridge active on port ${port}`);
    });
}
