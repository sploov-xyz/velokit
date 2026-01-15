# Getting Started

Welcome to **VeloKit**, the high-velocity scaffolding engine for Discord bots and APIs. This guide will help you build your first project in minutes.

## Prerequisites

Before running the VeloKit builder, ensure you have the following installed:
- **Node.js** (v20.0.0 or higher)
- **pnpm**, **npm**, or **yarn**
- A **Discord Bot Token** (if building a bot)

## The One-Command Setup

VeloKit is designed to be run without installation. Simply use `npx` to start the build engine:

```bash
npx @sploov/velokit
```

### Quick Start Options (v1.0.2+)

**Standard Mode (Interactive):**
```bash
npx @sploov/velokit
```

**Quick Mode (Smart Defaults):**
```bash
npx @sploov/velokit --quick
```

**Using Configuration Files:**
```bash
npx @sploov/velokit --config my-bot-config.json
```

**Preview Mode (Dry Run):**
```bash
npx @sploov/velokit --dry-run
```

**Save Configuration:**
```bash
npx @sploov/velokit --save-config my-setup.json
```

## First Steps after Building

Once the construction is complete, follow these steps to bring your project online:

1. **Enter the directory:**
   ```bash
   cd your-project-name
   ```
2. **Configure Environment:**
   Open the `.env` file and verify your keys. If you selected a database, add your connection string.
3. **Install Dependencies:**
   (If not already installed by the CLI)
   ```bash
   pnpm install
   ```
4. **Launch Development Mode:**
   ```bash
   pnpm run dev
   ```

## Project Structure

Your VeloKit project follows a modular, scalable architecture. For Discord bots:

- `/src/index.ts` (or `.js`): The entry point and client initialization.
- `/src/commands/`: Where your slash and prefix commands live.
- `/src/events/`: Discord event listeners (ready, messageCreate, etc.).
- `/src/utils/logger.ts`: The premium Sploov Logger utility.
- `/src/config.ts`: Automated environment validation.
- `README.md`: Auto-generated documentation (v1.0.2+)
- `.gitignore`: Smart ignore rules (v1.0.2+)

## What's Next?

- Explore [The Build Process](/guide/the-build-process)
- Learn about [CLI Reference](/guide/cli-reference)
- Check out [Advanced Configuration](/guide/advanced-config)
- Read about [Music Module](/guide/module-music)
- Discover [AI Integration](/guide/module-ai)
- Visit [Troubleshooting](/guide/troubleshooting) if you encounter issues
