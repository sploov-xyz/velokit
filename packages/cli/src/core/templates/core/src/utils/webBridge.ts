import express from 'express';
import { SploovClient } from '../index';
import { Logger } from '../utils/logger';

export function startWebBridge(client: SploovClient) {
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
