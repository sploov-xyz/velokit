import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { printInfo, printSuccess, printWarning, printError, printBox } from './utils/branding.js';

export interface MigrationContext {
    projectDir: string;
    currentVersion: string;
    targetVersion: string;
    backupDir?: string;
}

export interface Migration {
    from: string;
    to: string;
    description: string;
    apply: (context: MigrationContext) => Promise<void>;
}

const migrations: Migration[] = [
    // Example migration from 1.0.0 to 1.0.1
    {
        from: '1.0.0',
        to: '1.0.1',
        description: 'Update to multi-project support',
        apply: async (context) => {
            printInfo('Applying migration: 1.0.0 → 1.0.1');
            // Migration logic here
        }
    }
];

export async function detectProjectVersion(projectDir: string): Promise<string | null> {
    try {
        // Check for velokit config
        const configPath = path.join(projectDir, '.velokit.json');
        if (await fs.pathExists(configPath)) {
            const config = await fs.readJson(configPath);
            return config.version || null;
        }

        // Check package.json for velokit metadata
        const pkgPath = path.join(projectDir, 'package.json');
        if (await fs.pathExists(pkgPath)) {
            const pkg = await fs.readJson(pkgPath);
            if (pkg.velokit && pkg.velokit.version) {
                return pkg.velokit.version;
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}

export async function createBackup(projectDir: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(projectDir, '..', `${path.basename(projectDir)}-backup-${timestamp}`);
    
    await fs.copy(projectDir, backupDir, {
        filter: (src) => {
            // Don't backup node_modules or dist
            return !src.includes('node_modules') && !src.includes('dist');
        }
    });
    
    printSuccess(`Backup created: ${backupDir}`);
    return backupDir;
}

export async function migrateProject(projectDir: string, targetVersion: string): Promise<boolean> {
    try {
        // Detect current version
        const currentVersion = await detectProjectVersion(projectDir);
        
        if (!currentVersion) {
            printWarning('Could not detect project version');
            const manual = await inquirer.prompt([{
                type: 'input',
                name: 'version',
                message: 'Enter current VeloKit version:',
                default: '1.0.0'
            }]);
            
            if (!manual.version) {
                printError('Migration cancelled');
                return false;
            }
        }

        const context: MigrationContext = {
            projectDir,
            currentVersion: currentVersion || '1.0.0',
            targetVersion
        };

        printBox('MIGRATION PLAN', [
            `${chalk.cyan('From:')} ${context.currentVersion}`,
            `${chalk.cyan('To:')} ${targetVersion}`,
            `${chalk.cyan('Project:')} ${path.basename(projectDir)}`
        ]);

        // Ask for confirmation
        const confirm = await inquirer.prompt([{
            type: 'confirm',
            name: 'proceed',
            message: 'Create backup before migration?',
            default: true
        }]);

        if (confirm.proceed) {
            context.backupDir = await createBackup(projectDir);
        }

        // Find applicable migrations
        const applicableMigrations = findMigrationPath(context.currentVersion, targetVersion);
        
        if (applicableMigrations.length === 0) {
            printInfo('No migrations needed');
            return true;
        }

        printInfo(`Found ${applicableMigrations.length} migration(s) to apply`);

        // Apply migrations
        for (const migration of applicableMigrations) {
            printInfo(`Applying: ${migration.description}`);
            await migration.apply(context);
        }

        // Update version metadata
        await updateProjectVersion(projectDir, targetVersion);

        printSuccess('Migration completed successfully!');
        return true;

    } catch (error) {
        printError(`Migration failed: ${error}`);
        return false;
    }
}

function findMigrationPath(from: string, to: string): Migration[] {
    // Simple sequential migration finder
    const path: Migration[] = [];
    let current = from;

    while (current !== to) {
        const next = migrations.find(m => m.from === current);
        if (!next) break;
        path.push(next);
        current = next.to;
    }

    return path;
}

async function updateProjectVersion(projectDir: string, version: string): Promise<void> {
    // Update .velokit.json
    const configPath = path.join(projectDir, '.velokit.json');
    let config: any = {};
    
    if (await fs.pathExists(configPath)) {
        config = await fs.readJson(configPath);
    }
    
    config.version = version;
    config.lastMigration = new Date().toISOString();
    
    await fs.writeJson(configPath, config, { spaces: 2 });
    
    printInfo(`Updated project version to ${version}`);
}

export async function checkProjectHealth(projectDir: string): Promise<void> {
    printBox('PROJECT HEALTH CHECK', []);
    
    const checks = [
        { name: 'package.json', path: 'package.json' },
        { name: '.env file', path: '.env' },
        { name: 'src directory', path: 'src' },
        { name: 'node_modules', path: 'node_modules' }
    ];

    for (const check of checks) {
        const exists = await fs.pathExists(path.join(projectDir, check.path));
        const status = exists ? chalk.green('✓') : chalk.red('✗');
        console.log(`  ${status} ${check.name}`);
    }

    // Check for common issues
    console.log('\n' + chalk.cyan('  Common Issues:'));
    
    const envPath = path.join(projectDir, '.env');
    if (await fs.pathExists(envPath)) {
        const envContent = await fs.readFile(envPath, 'utf-8');
        if (!envContent.includes('DISCORD_TOKEN') && !envContent.includes('TOKEN')) {
            printWarning('  • No DISCORD_TOKEN found in .env');
        }
    }

    const nodeModules = path.join(projectDir, 'node_modules');
    if (!await fs.pathExists(nodeModules)) {
        printWarning('  • Dependencies not installed. Run npm/pnpm/yarn install');
    }

    console.log('');
}
