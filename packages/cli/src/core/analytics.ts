import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { printBox, printInfo } from './utils/branding.js';

export interface ProjectAnalytics {
    projectName: string;
    projectType: string;
    language?: string;
    fileCount: number;
    totalLines: number;
    commandCount?: number;
    eventCount?: number;
    dependencies: number;
    devDependencies: number;
    lastModified: Date;
}

export async function analyzeProject(projectDir: string): Promise<ProjectAnalytics> {
    const analytics: Partial<ProjectAnalytics> = {
        projectName: path.basename(projectDir),
        fileCount: 0,
        totalLines: 0,
        commandCount: 0,
        eventCount: 0,
        dependencies: 0,
        devDependencies: 0,
        lastModified: new Date()
    };

    // Analyze package.json
    const pkgPath = path.join(projectDir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
        const pkg = await fs.readJson(pkgPath);
        analytics.dependencies = Object.keys(pkg.dependencies || {}).length;
        analytics.devDependencies = Object.keys(pkg.devDependencies || {}).length;
    }

    // Detect project type
    const srcDir = path.join(projectDir, 'src');
    if (await fs.pathExists(srcDir)) {
        const commandsDir = path.join(srcDir, 'commands');
        const eventsDir = path.join(srcDir, 'events');
        
        if (await fs.pathExists(commandsDir)) {
            analytics.projectType = 'discord';
            analytics.commandCount = (await fs.readdir(commandsDir)).length;
        }
        
        if (await fs.pathExists(eventsDir)) {
            analytics.eventCount = (await fs.readdir(eventsDir)).length;
        }

        // Detect language
        const files = await fs.readdir(srcDir);
        if (files.some(f => f.endsWith('.ts'))) {
            analytics.language = 'TypeScript';
        } else if (files.some(f => f.endsWith('.js'))) {
            analytics.language = 'JavaScript';
        }

        // Count files and lines
        const { fileCount, totalLines } = await countFilesAndLines(srcDir);
        analytics.fileCount = fileCount;
        analytics.totalLines = totalLines;
    }

    return analytics as ProjectAnalytics;
}

async function countFilesAndLines(dir: string): Promise<{ fileCount: number; totalLines: number }> {
    let fileCount = 0;
    let totalLines = 0;

    async function walk(currentDir: string) {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory()) {
                if (entry.name !== 'node_modules' && entry.name !== 'dist') {
                    await walk(fullPath);
                }
            } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
                fileCount++;
                const content = await fs.readFile(fullPath, 'utf-8');
                totalLines += content.split('\n').length;
            }
        }
    }

    await walk(dir);
    return { fileCount, totalLines };
}

export async function generateHealthReport(projectDir: string): Promise<void> {
    const analytics = await analyzeProject(projectDir);

    printBox('PROJECT HEALTH REPORT', [
        `${chalk.cyan('Project:')} ${analytics.projectName}`,
        `${chalk.cyan('Type:')} ${analytics.projectType || 'Unknown'}`,
        ...(analytics.language ? [`${chalk.cyan('Language:')} ${analytics.language}`] : []),
        '',
        `${chalk.cyan('Code Statistics:')}`,
        `  Files: ${analytics.fileCount}`,
        `  Lines of Code: ${analytics.totalLines}`,
        ...(analytics.commandCount ? [`  Commands: ${analytics.commandCount}`] : []),
        ...(analytics.eventCount ? [`  Events: ${analytics.eventCount}`] : []),
        '',
        `${chalk.cyan('Dependencies:')}`,
        `  Production: ${analytics.dependencies}`,
        `  Development: ${analytics.devDependencies}`,
        '',
        `${chalk.cyan('Last Modified:')} ${analytics.lastModified.toLocaleString()}`
    ]);

    // Health score
    let score = 0;
    const maxScore = 100;

    if (analytics.fileCount > 0) score += 20;
    if (analytics.totalLines > 100) score += 20;
    if (analytics.dependencies > 0) score += 15;
    if (analytics.commandCount && analytics.commandCount > 0) score += 15;
    if (analytics.eventCount && analytics.eventCount > 0) score += 15;
    
    // Check for important files
    const hasEnv = await fs.pathExists(path.join(projectDir, '.env'));
    const hasGit = await fs.pathExists(path.join(projectDir, '.git'));
    const hasReadme = await fs.pathExists(path.join(projectDir, 'README.md'));
    
    if (hasEnv) score += 5;
    if (hasGit) score += 5;
    if (hasReadme) score += 5;

    const scoreColor = score >= 80 ? 'green' : score >= 50 ? 'yellow' : 'red';
    console.log(`\n  ${chalk.cyan('Health Score:')} ${chalk[scoreColor].bold(`${score}/${maxScore}`)}\n`);

    // Recommendations
    const recommendations: string[] = [];
    
    if (!hasEnv) recommendations.push('• Create .env file for environment variables');
    if (!hasGit) recommendations.push('• Initialize Git repository');
    if (!hasReadme) recommendations.push('• Add README.md documentation');
    if (analytics.fileCount < 5) recommendations.push('• Consider adding more structure to your project');
    if (analytics.dependencies === 0) recommendations.push('• Install required dependencies');

    if (recommendations.length > 0) {
        console.log(chalk.yellow('  Recommendations:'));
        recommendations.forEach(rec => console.log(chalk.gray(`    ${rec}`)));
        console.log('');
    }
}
