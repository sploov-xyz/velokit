# Getting Started

Welcome to **VeloKit**, the high-velocity scaffolding engine for Discord bots. This guide will help you forge your first project in minutes.

## Prerequisites

Before running the VeloKit forge, ensure you have the following installed:
- **Node.js** (v20.0.0 or higher)
- **pnpm**, **npm**, or **yarn**
- A **Discord Bot Token** (obtainable from the [Discord Developer Portal](https://discord.com/developers/applications))

## The One-Command Setup

VeloKit is designed to be run without installation. Simply use `npx` to start the forge:

```bash
npx velokit
```

## First Steps after Forging

Once the forge is complete, follow these steps to bring your bot online:

1. **Enter the directory:**
   ```bash
   cd your-bot-name
   ```
2. **Configure Environment:**
   Open the `.env` file and verify your `DISCORD_TOKEN`. If you selected a database, add your `MONGODB_URI`.
3. **Install Dependencies:**
   ```bash
   pnpm install
   ```
4. **Launch Development Mode:**
   ```bash
   pnpm run dev
   ```

## Project Structure

Your forged bot follows a clean, handler-based architecture:

- `/src/index.ts`: The entry point and client initialization.
- `/src/commands/`: Where your slash and prefix commands live.
- `/src/events/`: Discord event listeners (ready, messageCreate, etc.).
- `/src/utils/logger.ts`: The premium Sploov Logger utility.
- `/src/config.ts`: Automated environment validation.
