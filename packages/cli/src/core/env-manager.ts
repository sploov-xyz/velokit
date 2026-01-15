import fs from 'fs-extra';
import path from 'path';
import { printInfo, printSuccess, printWarning } from './utils/branding.js';

export interface EnvVariable {
    key: string;
    value: string;
    description?: string;
    required?: boolean;
}

export class EnvManager {
    private envPath: string;
    private envExamplePath: string;
    private variables: Map<string, EnvVariable>;

    constructor(projectDir: string) {
        this.envPath = path.join(projectDir, '.env');
        this.envExamplePath = path.join(projectDir, '.env.example');
        this.variables = new Map();
    }

    async load(): Promise<void> {
        if (await fs.pathExists(this.envPath)) {
            const content = await fs.readFile(this.envPath, 'utf-8');
            this.parseEnv(content);
        }
    }

    private parseEnv(content: string): void {
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
                const [, key, value] = match;
                this.variables.set(key.trim(), {
                    key: key.trim(),
                    value: value.trim()
                });
            }
        }
    }

    set(key: string, value: string, description?: string): void {
        this.variables.set(key, { key, value, description });
    }

    get(key: string): string | undefined {
        return this.variables.get(key)?.value;
    }

    has(key: string): boolean {
        return this.variables.has(key);
    }

    delete(key: string): void {
        this.variables.delete(key);
    }

    async save(): Promise<void> {
        let content = '# Environment Variables\n';
        content += `# Generated: ${new Date().toISOString()}\n\n`;

        for (const [key, variable] of this.variables) {
            if (variable.description) {
                content += `# ${variable.description}\n`;
            }
            content += `${variable.key}=${variable.value}\n\n`;
        }

        await fs.writeFile(this.envPath, content);
        printSuccess('.env file updated');
    }

    async saveExample(): Promise<void> {
        let content = '# Environment Variables Example\n';
        content += '# Copy this file to .env and fill in your values\n\n';

        for (const [key, variable] of this.variables) {
            if (variable.description) {
                content += `# ${variable.description}\n`;
            }
            if (variable.required) {
                content += `# REQUIRED\n`;
            }
            content += `${variable.key}=\n\n`;
        }

        await fs.writeFile(this.envExamplePath, content);
        printInfo('.env.example file created');
    }

    validate(): { valid: boolean; missing: string[] } {
        const missing: string[] = [];

        for (const [key, variable] of this.variables) {
            if (variable.required && !variable.value) {
                missing.push(key);
            }
        }

        return {
            valid: missing.length === 0,
            missing
        };
    }

    async merge(other: EnvManager): Promise<void> {
        for (const [key, variable] of other.variables) {
            if (!this.variables.has(key)) {
                this.variables.set(key, variable);
            }
        }
        await this.save();
    }
}

export async function generateEnvFile(
    targetDir: string,
    projectType: 'discord' | 'express' | 'api',
    config: any
): Promise<void> {
    const manager = new EnvManager(targetDir);

    // Common variables
    manager.set('NODE_ENV', 'development', 'Node environment (development/production)');
    manager.set('PORT', '3000', 'Application port');

    // Discord-specific
    if (projectType === 'discord') {
        manager.set('DISCORD_TOKEN', config.token || '', 'Your Discord bot token');
        manager.set('CLIENT_ID', '', 'Your Discord application client ID');
        manager.set('GUILD_ID', '', 'Your Discord server (guild) ID for testing');
        manager.set('OWNER_ID', '', 'Your Discord user ID');

        if (config.soul === 'music') {
            manager.set('LAVALINK_HOST', config.moduleConfig?.host || 'localhost', 'Lavalink host');
            manager.set('LAVALINK_PORT', config.moduleConfig?.port || '2333', 'Lavalink port');
            manager.set('LAVALINK_PASS', config.moduleConfig?.password || 'youshallnotpass', 'Lavalink password');
            manager.set('LAVALINK_SECURE', 'false', 'Use SSL/TLS for Lavalink connection');
        }

        if (config.soul === 'ai') {
            manager.set('AI_PROVIDER', config.moduleConfig?.provider || 'Gemini', 'AI provider (Gemini/OpenAI/Groq)');
            manager.set('AI_API_KEY', config.moduleConfig?.apiKey || '', 'AI provider API key');
        }

        if (config.db === 'MongoDB (Mongoose)') {
            manager.set('MONGODB_URI', 'mongodb://localhost:27017/velokit', 'MongoDB connection URI');
        } else if (config.db === 'PostgreSQL (Prisma)') {
            manager.set('DATABASE_URL', 'postgresql://user:password@localhost:5432/velokit', 'PostgreSQL connection URL');
        }

        if (config.webBridge) {
            manager.set('WEB_PORT', '8080', 'Web bridge port');
            manager.set('WEB_HOST', 'localhost', 'Web bridge host');
        }
    }

    // Express/API specific
    if (projectType === 'express' || projectType === 'api') {
        manager.set('API_KEY', '', 'API authentication key');
        manager.set('JWT_SECRET', '', 'JWT signing secret');
        manager.set('DATABASE_URL', '', 'Database connection URL');
        manager.set('CORS_ORIGIN', '*', 'CORS allowed origins');
    }

    await manager.save();
    await manager.saveExample();
}
