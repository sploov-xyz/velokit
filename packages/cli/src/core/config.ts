import fs from 'fs';
import path from 'path';

export interface VeloKitConfig {
    project: {
        type: 'discord' | 'api';
        name: string;
        packageManager: 'npm' | 'pnpm' | 'yarn';
    };
    discord?: {
        language: 'ts' | 'js';
        soul?: string;
        extras?: string[];
        infrastructure?: {
            db?: string;
            docker?: boolean;
            webBridge?: boolean;
        };
    };
    api?: {
        framework: string;
    };
}

export function loadConfigFile(configPath: string): VeloKitConfig | null {
    try {
        const absolutePath = path.resolve(process.cwd(), configPath);
        if (!fs.existsSync(absolutePath)) {
            return null;
        }
        
        const configContent = fs.readFileSync(absolutePath, 'utf-8');
        return JSON.parse(configContent);
    } catch (error) {
        console.error('Error loading config file:', error);
        return null;
    }
}

export function saveConfigFile(config: VeloKitConfig, outputPath: string): boolean {
    try {
        const absolutePath = path.resolve(process.cwd(), outputPath);
        fs.writeFileSync(absolutePath, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving config file:', error);
        return false;
    }
}
