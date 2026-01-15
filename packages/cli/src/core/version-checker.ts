import chalk from 'chalk';
import { printWarning } from './utils/branding.js';

export async function checkForUpdates(currentVersion: string): Promise<void> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('https://registry.npmjs.org/@sploov/velokit/latest', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            const latestVersion = data.version;
            
            if (isNewerVersion(latestVersion, currentVersion)) {
                printWarning(
                    `New version available: ${chalk.bold(latestVersion)} (current: ${currentVersion})\n` +
                    `  Run: ${chalk.bold.cyan('npm i -g @sploov/velokit@latest')} to update`
                );
            }
        }
    } catch (error) {
        // Silently fail - don't interrupt the user experience
    }
}

function isNewerVersion(latest: string, current: string): boolean {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
        if (latestParts[i] > currentParts[i]) return true;
        if (latestParts[i] < currentParts[i]) return false;
    }
    
    return false;
}

const tips = [
    '💡 Tip: Use TypeScript for better IntelliSense support',
    '🎵 Tip: Lavalink requires Java 17 or higher',
    '🔐 Tip: Never commit your .env file to Git',
    '📚 Tip: Check out our docs at https://velokit.sploov.xyz',
    '🚀 Tip: Use pnpm for faster installations',
    '🎨 Tip: Customize your bot\'s commands in the /commands folder',
    '⚙️ Tip: Events are automatically loaded from /events',
    '🐳 Tip: Use Docker for consistent development environments',
    '🔧 Tip: The handler system makes adding features easy',
    '✨ Tip: Star us on GitHub to support the project!'
];

export function getRandomTip(): string {
    return tips[Math.floor(Math.random() * tips.length)];
}
