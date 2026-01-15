import fs from 'fs-extra';
import path from 'path';
import { printInfo, printSuccess, printWarning, printError } from './utils/branding.js';

export interface GitConfig {
    autoInit: boolean;
    initialCommit?: string;
    remoteUrl?: string;
    branch?: string;
}

export async function initializeGit(targetDir: string, config?: GitConfig): Promise<boolean> {
    try {
        const execa = (await import('execa')).default;
        
        // Check if git is available
        try {
            await execa('git', ['--version']);
        } catch {
            printWarning('Git is not installed. Skipping git initialization.');
            return false;
        }

        // Check if already a git repo
        const gitDir = path.join(targetDir, '.git');
        if (await fs.pathExists(gitDir)) {
            printInfo('Git repository already initialized');
            return true;
        }

        // Initialize git
        await execa('git', ['init'], { cwd: targetDir });
        printInfo('Git repository initialized');

        // Set default branch if specified
        if (config?.branch) {
            await execa('git', ['branch', '-M', config.branch], { cwd: targetDir });
        }

        // Add remote if specified
        if (config?.remoteUrl) {
            await execa('git', ['remote', 'add', 'origin', config.remoteUrl], { cwd: targetDir });
            printInfo(`Remote added: ${config.remoteUrl}`);
        }

        // Initial commit
        if (config?.initialCommit) {
            await execa('git', ['add', '.'], { cwd: targetDir });
            await execa('git', ['commit', '-m', config.initialCommit], { cwd: targetDir });
            printSuccess('Initial commit created');
        }

        return true;
    } catch (error) {
        printError(`Git initialization failed: ${error}`);
        return false;
    }
}

export function generateGitignore(projectType: 'discord' | 'express' | 'api', options?: { language?: string; docker?: boolean }): string {
    const common = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
package-lock.json
yarn.lock

# Environment Variables
.env
.env.local
.env.*.local
*.env

# Logs
logs/
*.log

# OS Files
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# IDE
.vscode/
.idea/
*.sublime-*
.project
.classpath
.settings/

# Build Output
dist/
build/
out/
*.tsbuildinfo

# Testing
coverage/
.nyc_output/

# Temporary Files
tmp/
temp/
*.tmp`;

    let specific = '';

    if (projectType === 'discord') {
        specific = `
# Discord Bot Specific
config.json
bot-config.json

# Database
*.db
*.sqlite
*.sqlite3
data/`;
    } else if (projectType === 'express' || projectType === 'api') {
        specific = `
# API Specific
uploads/
public/uploads/`;
    }

    if (options?.language === 'ts') {
        specific += `
# TypeScript
*.js.map
*.d.ts.map`;
    }

    if (options?.docker) {
        specific += `
# Docker (keep docker files, ignore volumes)
docker-compose.override.yml
.docker/`;
    }

    return common + specific + '\n';
}

export function generateGitAttributes(): string {
    return `# Auto detect text files and perform LF normalization
* text=auto

# Source files
*.ts text
*.js text
*.json text
*.md text
*.yml text
*.yaml text

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
*.otf binary
`;
}

export async function setupGitFiles(targetDir: string, projectType: 'discord' | 'express' | 'api', options?: { language?: string; docker?: boolean }): Promise<void> {
    try {
        // Create .gitignore
        const gitignore = generateGitignore(projectType, options);
        await fs.writeFile(path.join(targetDir, '.gitignore'), gitignore);
        
        // Create .gitattributes
        const gitattributes = generateGitAttributes();
        await fs.writeFile(path.join(targetDir, '.gitattributes'), gitattributes);
        
        printInfo('Git configuration files created');
    } catch (error) {
        printError(`Failed to create git files: ${error}`);
    }
}
