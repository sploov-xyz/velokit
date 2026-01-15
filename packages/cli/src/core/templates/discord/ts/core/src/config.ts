import { config as dotenvConfig } from 'dotenv';
import { Logger } from './utils/logger';

dotenvConfig();

interface Config {
    token: string;
    mongoUri: string;
    ownerId: string;
    [key: string]: string | undefined;
}

const requiredKeys = ['DISCORD_TOKEN'];

export const validateConfig = (): Config => {
    const missingKeys = requiredKeys.filter(key => !process.env[key]);

    if (missingKeys.length > 0) {
        Logger.error(`Missing required environment variables: ${missingKeys.join(', ')}`);
        Logger.warn('Please check your .env file.');
        process.exit(1);
    }

    return {
        token: process.env.DISCORD_TOKEN!,
        mongoUri: process.env.MONGODB_URI || '',
        ownerId: process.env.OWNER_ID || '',
        ...process.env
    };
};

export const config = validateConfig();
