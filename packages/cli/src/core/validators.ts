import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export function validateProjectName(input: string): boolean | string {
    if (!input || input.trim().length === 0) {
        return 'Project name cannot be empty';
    }
    
    if (!/^[a-z0-9-_]+$/i.test(input)) {
        return 'Project name can only contain letters, numbers, hyphens, and underscores';
    }
    
    if (input.length > 214) {
        return 'Project name must be less than 214 characters';
    }
    
    return true;
}

export function checkDirectoryExists(projectName: string): { exists: boolean; path: string } {
    const projectPath = path.join(process.cwd(), projectName);
    return {
        exists: fs.existsSync(projectPath),
        path: projectPath
    };
}

export function validateNodeVersion(): { valid: boolean; current: string; required: string } {
    const currentVersion = process.version;
    const majorVersion = parseInt(currentVersion.slice(1).split('.')[0]);
    const required = '16.0.0';
    
    return {
        valid: majorVersion >= 16,
        current: currentVersion,
        required: `>=${required}`
    };
}
