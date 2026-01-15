import chalk from 'chalk';

export function generateReadme(config: {
    projectName: string;
    projectType: 'discord' | 'express';
    language?: 'ts' | 'js';
    soul?: string;
    extras?: string[];
    db?: string;
    docker?: boolean;
    webBridge?: boolean;
}): string {
    const { projectName, projectType, language, soul, extras, db, docker, webBridge } = config;

    if (projectType === 'discord') {
        return `# ${projectName}

A Discord bot built with [VeloKit](https://velokit.sploov.xyz) - the high-velocity project scaffolder.

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- ${language === 'ts' ? 'TypeScript knowledge' : 'JavaScript (ESM) knowledge'}
- Discord Bot Token ([Get one here](https://discord.com/developers/applications))
${soul === 'music' ? '- Lavalink server (for music functionality)\n' : ''}${soul === 'ai' ? '- AI API Key (Gemini/Groq/OpenAI)\n' : ''}
### Installation

\`\`\`bash
# Install dependencies
npm install  # or pnpm install / yarn install

# Configure environment
cp .env.example .env
# Edit .env and add your tokens
\`\`\`

### Environment Variables

\`\`\`env
DISCORD_TOKEN=your_bot_token_here
${soul === 'music' ? `LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASS=youshallnotpass
` : ''}${soul === 'ai' ? `AI_API_KEY=your_api_key_here
AI_PROVIDER=Gemini
` : ''}${db && db !== 'None' ? `MONGODB_URI=mongodb://localhost:27017/${projectName}
` : ''}OWNER_ID=your_discord_user_id
\`\`\`

### Running the Bot

\`\`\`bash
# Development mode${language === 'ts' ? ' (with auto-reload)' : ''}
npm run dev

# Production mode
npm start
\`\`\`

${docker ? `### Docker Support

\`\`\`bash
# Build and run with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the bot
docker-compose down
\`\`\`

` : ''}## 📁 Project Structure

\`\`\`
${projectName}/
├── src/
│   ├── commands/          # Slash commands
${soul === 'music' ? '│   │   ├── play.ts\n│   │   ├── skip.ts\n│   │   └── ...\n' : ''}${soul === 'ai' ? '│   │   ├── chat.ts\n│   │   ├── image.ts\n│   │   └── ...\n' : ''}│   ├── events/            # Discord events
│   │   ├── ready.ts
│   │   ├── interactionCreate.ts
│   │   └── messageCreate.ts
│   ├── handlers/          # Command & event handlers
│   ├── utils/             # Utility functions
│   ├── config.${language}           # Bot configuration
│   └── index.${language}            # Entry point
├── ${language === 'ts' ? 'tsconfig.json' : 'jsconfig.json'}
├── package.json
└── .env
\`\`\`

## 🎯 Features

- ✅ Discord.js v14
- ✅ ${language === 'ts' ? 'TypeScript' : 'JavaScript (ESM)'}
- ✅ Slash Commands Support
- ✅ Event Handler System
- ✅ Command Handler System
${soul === 'music' ? '- ✅ Music Playback (Lavalink)\n' : ''}${soul === 'ai' ? '- ✅ AI Integration\n' : ''}${soul === 'mod' || extras?.includes('extra_mod') ? '- ✅ Moderation Commands\n' : ''}${soul === 'economy' ? '- ✅ Economy System\n' : ''}${extras?.includes('extra_util') ? '- ✅ Utility Commands\n' : ''}${extras?.includes('extra_owner') ? '- ✅ Owner-only Commands\n' : ''}${webBridge ? '- ✅ Web Bridge (Express Dashboard)\n' : ''}${db && db !== 'None' ? '- ✅ Database Integration\n' : ''}${docker ? '- ✅ Docker Support\n' : ''}
## 📚 Documentation

### Adding Commands

Create a new file in \`src/commands/\`:

\`\`\`${language}
${language === 'ts' ? `import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello'),
    async execute(interaction: any) {
        await interaction.reply('Hello!');
    }
};` : `export default {
    data: {
        name: 'hello',
        description: 'Says hello'
    },
    async execute(interaction) {
        await interaction.reply('Hello!');
    }
};`}
\`\`\`

### Adding Events

Create a new file in \`src/events/\`:

\`\`\`${language}
${language === 'ts' ? `export default {
    name: 'guildMemberAdd',
    once: false,
    async execute(member: any) {
        console.log(\`\${member.user.tag} joined the server!\`);
    }
};` : `export default {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        console.log(\`\${member.user.tag} joined the server!\`);
    }
};`}
\`\`\`

${soul === 'music' ? `### Music Commands

This bot includes Lavalink integration for high-quality music playback:

- \`/play <song>\` - Play a song
- \`/skip\` - Skip current song
- \`/stop\` - Stop playback
- \`/queue\` - View queue
- \`/volume <0-100>\` - Adjust volume

**Setup Lavalink:**
1. Download Lavalink from [here](https://github.com/lavalink-devs/Lavalink/releases)
2. Run: \`java -jar Lavalink.jar\`
3. Update your .env with Lavalink credentials

` : ''}${soul === 'ai' ? `### AI Commands

This bot includes AI integration:

- \`/chat <message>\` - Chat with AI
- \`/image <prompt>\` - Generate images with AI

Make sure to add your API key in the .env file.

` : ''}## 🛠️ Development

### Scripts

- \`npm run dev\` - Start in development mode
- \`npm start\` - Start in production mode
${language === 'ts' ? '- `npm run build` - Compile TypeScript\n' : ''}
### Tips

- Commands are automatically registered on startup
- Events are automatically loaded from the events folder
- Use the logger utility for consistent logging
- Check [Discord.js Guide](https://discordjs.guide) for more examples

## 📖 Resources

- [VeloKit Documentation](https://velokit.sploov.xyz)
- [Discord.js Guide](https://discordjs.guide)
- [Discord.js Documentation](https://discord.js.org)
${soul === 'music' ? '- [Lavalink Setup Guide](https://velokit.sploov.xyz/guide/module-music)\n' : ''}${soul === 'ai' ? '- [AI Module Guide](https://velokit.sploov.xyz/guide/module-ai)\n' : ''}
## 🤝 Support

- [VeloKit Discord Server](https://discord.gg/sploov)
- [GitHub Issues](https://github.com/sploov-xyz/velokit/issues)

## 📄 License

This project was scaffolded with VeloKit. Check the [VeloKit License](https://github.com/sploov-xyz/velokit).

---

Built with ❤️ using [VeloKit](https://velokit.sploov.xyz) by Sploov Team
`;
    } else {
        // Express API README
        return `# ${projectName}

A REST API built with [VeloKit](https://velokit.sploov.xyz) and Express.js.

## 🚀 Quick Start

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Running the API

\`\`\`bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
\`\`\`

The API will be available at \`http://localhost:3000\`

## 📁 Project Structure

\`\`\`
${projectName}/
├── routes/              # API routes
├── index.js             # Entry point
├── package.json
└── .env
\`\`\`

## 📖 API Endpoints

### GET /
Returns API status and information.

### GET /health
Health check endpoint.

## 🛠️ Development

Add your routes in the \`routes/\` directory and import them in \`index.js\`.

## 📚 Resources

- [Express.js Documentation](https://expressjs.com)
- [VeloKit Documentation](https://velokit.sploov.xyz)

---

Built with ❤️ using [VeloKit](https://velokit.sploov.xyz) by Sploov Team
`;
    }
}

// generateGitignore moved to git-integration.ts
