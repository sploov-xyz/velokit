# Music Module

The VeloKit Music module is built for high-performance audio streaming using industry-standard nodes.

## Supported Engines
- **Lavalink:** The gold standard for Discord music bots.
- **NodeLink:** A lightweight alternative for simpler deployments.

## Included Features
- **Auto-Connection:** The bot automatically connects to your configured nodes on startup.
- **Basic Commands:** Includes a pre-written `play.ts` template.
- **Voice State Handling:** Pre-configured intents for voice channel tracking.

## Configuration
All music settings are managed via the `.env` file generated during the forge:
```env
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASS=youshallnotpass
```
