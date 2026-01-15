#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { printBanner, printSection, printBox, typewriter, printSuccess, printWarning, printInfo, printError, printTree } from './utils/branding.js';
import { validateProjectName, checkDirectoryExists, validateNodeVersion } from './validators.js';
import { loadConfigFile, saveConfigFile, VeloKitConfig } from './config.js';
import { checkForUpdates, getRandomTip } from './version-checker.js';
import { generateReadme } from './generators.js';
import { PluginManager, createPluginScaffold } from './plugin-system.js';
import { initializeGit, setupGitFiles, generateGitignore, generateGitAttributes } from './git-integration.js';
import { migrateProject, checkProjectHealth } from './migration-system.js';
import { setupTestingFiles } from './testing-setup.js';
import { generateEnvFile } from './env-manager.js';
import { generateHealthReport } from './analytics.js';

const VERSION = '1.0.3';
const program = new Command();

const BRAND_AQUA = '#26d0ce';
const BRAND_BLUE = '#1a2980';

program
    .name('velokit')
    .description('The Ultimate Project Scaffolder by Sploov')
    .version(VERSION)
    .option('--config <path>', 'Use config file')
    .option('--quick', 'Quick mode with smart defaults')
    .option('--dry-run', 'Preview without creating files')
    .option('--save-config <path>', 'Save configuration to file')
    .option('--no-git', 'Skip git initialization')
    .option('--no-install', 'Skip dependency installation');

program
    .action(async (options) => {
        // Node version check
        const nodeCheck = validateNodeVersion();
        if (!nodeCheck.valid) {
            printError(`Node.js ${nodeCheck.required} is required. Current: ${nodeCheck.current}`);
            process.exit(1);
        }

        printBanner(VERSION);
        
        // Check for updates (non-blocking)
        checkForUpdates(VERSION);
        
        // Load plugins
        const pluginManager = new PluginManager();
        await pluginManager.loadPlugins();
        
        await typewriter('Initializing VeloKit Build Engine...');
        console.log('');

        // Load config file if provided
        let config: VeloKitConfig | null = null;
        if (options.config) {
            config = loadConfigFile(options.config);
            if (!config) {
                printError(`Could not load config file: ${options.config}`);
                process.exit(1);
            }
            printInfo(`Loaded configuration from ${options.config}`);
        }

        // --- Project Type Selection ---
        const totalSteps = config ? 2 : 6; // Fewer steps if using config
        let currentStep = 1;

        printSection('Project Initialization', `Step ${currentStep}/${totalSteps}`);
        
        const project = config ? config.project : await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: chalk.white('Select Project Type:'),
                choices: [
                    { name: 'Discord Bot', value: 'discord' },
                    { name: `Express API (REST) ${chalk.hex(BRAND_AQUA).bold('[NEW]')}`, value: 'express' },
                    { name: chalk.gray('Web App (React) - Coming Soon'), value: 'react', disabled: 'In Development' }
                ],
                default: options.quick ? 'discord' : undefined
            },
            {
                type: 'input',
                name: 'name',
                message: chalk.white('Project Name:'),
                default: (answers: any) => answers.type === 'discord' ? 'my-velokit-bot' : 'my-velokit-api',
                validate: validateProjectName
            },
            {
                type: 'list',
                name: 'packageManager',
                message: chalk.white('Package Manager:'),
                choices: ['pnpm', 'npm', 'yarn'],
                default: 'pnpm'
            }
        ]);

        // Check if directory exists
        const dirCheck = checkDirectoryExists(project.name);
        if (dirCheck.exists) {
            printWarning(`Directory "${project.name}" already exists at:\n  ${dirCheck.path}`);
            const overwrite = await inquirer.prompt([{
                type: 'confirm',
                name: 'proceed',
                message: chalk.yellow('Overwrite existing directory?'),
                default: false
            }]);
            if (!overwrite.proceed) {
                console.log(chalk.gray('\n  Build cancelled.\n'));
                process.exit(0);
            }
        }

        currentStep++;

        let discordConfig: any = {};
        let expressConfig: any = {};

        // --- Discord Logic ---
        if (project.type === 'discord') {
            printSection('Bot Identity', `Step ${currentStep}/${totalSteps}`);
            const identity = config?.discord ? { token: '', language: config.discord.language } : await inquirer.prompt([
                {
                    type: 'password',
                    name: 'token',
                    message: chalk.white('Discord Bot Token (optional):'),
                    mask: chalk.hex(BRAND_AQUA)('*')
                },
                {
                    type: 'list',
                    name: 'language',
                    message: chalk.white('Language:'),
                    choices: [
                        { name: 'TypeScript', value: 'ts' },
                        { name: `JavaScript (ESM) ${chalk.hex(BRAND_AQUA).bold('[NEW]')}`, value: 'js' }
                    ],
                    default: 'ts'
                }
            ]);

            currentStep++;
            printSection('Core Architecture', `Step ${currentStep}/${totalSteps}`);
            const core = config?.discord?.soul ? { soul: config.discord.soul } : await inquirer.prompt([
                {
                    type: 'list',
                    name: 'soul',
                    message: chalk.white('Select Bot Focus:'),
                    choices: [
                        { name: chalk.hex(BRAND_AQUA)('Music') + ' (Lavalink/NodeLink)', value: 'music' },
                        { name: chalk.hex(BRAND_AQUA)('AI') + ' (Gemini/Groq/OpenAI)', value: 'ai' },
                        { name: chalk.hex(BRAND_AQUA)('Moderation') + ' & Management', value: 'mod' },
                        { name: chalk.hex(BRAND_AQUA)('Economy') + ' & Games', value: 'economy' }
                    ]
                }
            ]);

            let moduleConfig: any = {};
            if (core.soul === 'music' || core.soul === 'ai') {
                currentStep++;
                printSection('Engine Configuration', `Step ${currentStep}/${totalSteps}`);
                if (core.soul === 'music') {
                    moduleConfig = await inquirer.prompt([
                        { type: 'list', name: 'engine', message: 'Music Engine:', choices: ['Lavalink', 'NodeLink'] },
                        { type: 'input', name: 'host', message: 'Host Address:', default: 'localhost' },
                        { type: 'input', name: 'port', message: 'Port:', default: '2333' },
                        { type: 'password', name: 'password', message: 'Password:', default: 'youshallnotpass' }
                    ]);
                } else {
                    moduleConfig = await inquirer.prompt([
                        { type: 'list', name: 'provider', message: 'AI Provider:', choices: ['Gemini', 'Groq', 'OpenAI'] },
                        { type: 'password', name: 'apiKey', message: 'Provider API Key:' }
                    ]);
                }
            }

            currentStep++;
            printSection('Additional Modules', `Step ${currentStep}/${totalSteps}`);
            const extras = config?.discord?.extras ? { selectedExtras: config.discord.extras } : await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'selectedExtras',
                    message: chalk.white('Layer on features:'),
                    choices: [
                        { name: 'Basic Moderation', value: 'extra_mod' },
                        { name: 'Utility & Stats', value: 'extra_util' },
                        { name: 'Owner Controls', value: 'extra_owner' }
                    ]
                }
            ]);

            currentStep++;
            printSection('Infrastructure', `Step ${currentStep}/${totalSteps}`);
            const infra = config?.discord?.infrastructure ? config.discord.infrastructure : await inquirer.prompt([
                {
                    type: 'list',
                    name: 'db',
                    message: chalk.white('Primary Database:'),
                    choices: ['MongoDB (Mongoose)', 'PostgreSQL (Prisma)', 'None'],
                    default: 'MongoDB (Mongoose)'
                },
                { type: 'confirm', name: 'webBridge', message: chalk.white('Include Web Bridge (Express)?'), default: false },
                { type: 'confirm', name: 'docker', message: chalk.white('Generate Docker Files?'), default: false }
            ]);

            // Additional setup options
            const setupOptions = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'testFramework',
                    message: chalk.white('Testing Framework:'),
                    choices: [
                        { name: 'Jest', value: 'jest' },
                        { name: 'Vitest', value: 'vitest' },
                        { name: 'None', value: 'none' }
                    ],
                    default: 'none'
                },
                {
                    type: 'list',
                    name: 'cicd',
                    message: chalk.white('CI/CD Template:'),
                    choices: [
                        { name: 'GitHub Actions', value: 'github' },
                        { name: 'GitLab CI', value: 'gitlab' },
                        { name: 'None', value: 'none' }
                    ],
                    default: 'none'
                }
            ]);

            discordConfig = { ...identity, ...core, moduleConfig, ...extras, ...infra, ...setupOptions };
        }

        // --- Confirmation & Configuration Preview ---
        console.log('\n');
        printSection('Configuration Summary', `Step ${totalSteps}/${totalSteps}`);
        
        // Build config tree
        const configTree: any = {
            'Project Type': project.type.toUpperCase(),
            'Project Name': project.name,
            'Package Manager': project.packageManager
        };

        if (project.type === 'discord') {
            configTree['Language'] = discordConfig.language.toUpperCase();
            configTree['Bot Focus'] = discordConfig.soul.toUpperCase();
            if (discordConfig.selectedExtras?.length > 0) {
                configTree['Extra Modules'] = discordConfig.selectedExtras;
            }
            configTree['Infrastructure'] = {
                'Database': discordConfig.db,
                'Web Bridge': discordConfig.webBridge ? 'Yes' : 'No',
                'Docker': discordConfig.docker ? 'Yes' : 'No'
            };
        }

        console.log(chalk.hex(BRAND_AQUA).bold('\n  📋 Your Configuration:\n'));
        printTree(configTree);

        // Save config option
        if (options.saveConfig) {
            const configToSave: VeloKitConfig = {
                project,
                discord: project.type === 'discord' ? {
                    language: discordConfig.language,
                    soul: discordConfig.soul,
                    extras: discordConfig.selectedExtras,
                    infrastructure: {
                        db: discordConfig.db,
                        docker: discordConfig.docker,
                        webBridge: discordConfig.webBridge
                    }
                } : undefined
            };
            if (saveConfigFile(configToSave, options.saveConfig)) {
                printInfo(`Configuration saved to ${options.saveConfig}`);
            }
        }

        // Dry run exit
        if (options.dryRun) {
            console.log('\n' + chalk.gray('  [DRY RUN] No files were created.\n'));
            process.exit(0);
        }

        const confirm = await inquirer.prompt([{ 
            type: 'confirm', 
            name: 'proceed', 
            message: chalk.hex(BRAND_AQUA).bold('Start Build?'), 
            default: true 
        }]);
        if (!confirm.proceed) {
            console.log(chalk.gray('\n  Build cancelled.\n'));
            process.exit(0);
        }

        // --- Construction ---
        console.log('');
        const spinner = ora({
            text: chalk.hex(BRAND_AQUA)('Constructing architecture...'),
            color: 'cyan'
        }).start();

        try {
            const targetDir = path.join(process.cwd(), project.name);
            await fs.ensureDir(targetDir);

            // Execute beforeGenerate plugin hooks
            await pluginManager.executeHook('beforeGenerate', { project, discordConfig, expressConfig });

            // Template Handling
            if (project.type === 'discord') {
                const templateDir = path.join(__dirname, 'templates', 'discord', discordConfig.language, 'core');
                await fs.copy(templateDir, targetDir);

                // Modules
                const moduleBase = path.join(__dirname, 'templates', 'discord', discordConfig.language, 'modules');
                const modules = [discordConfig.soul, ...discordConfig.selectedExtras];
                for (const mod of modules) {
                    const modDir = path.join(moduleBase, mod);
                    if (await fs.pathExists(modDir)) await fs.copy(modDir, targetDir, { overwrite: true });
                }

                // Variable Replacement
                const processTemplate = async (file: string, data: any) => {
                    const filePath = path.join(targetDir, file);
                    if (await fs.pathExists(filePath)) {
                        let content = await fs.readFile(filePath, 'utf8');
                        for (const key in data) content = content.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
                        await fs.writeFile(filePath.replace('.template', ''), content);
                        if (filePath.endsWith('.template')) await fs.remove(filePath);
                    }
                };

                const extraIntents = (discordConfig.soul === 'music' ? 'GatewayIntentBits.GuildVoiceStates, ' : '') + 
                                    (discordConfig.selectedExtras.includes('extra_mod') ? 'GatewayIntentBits.GuildMembers, ' : '');

                const deps = [];
                if (discordConfig.db === 'MongoDB (Mongoose)') deps.push('"mongoose": "^8.1.1"');
                if (discordConfig.db === 'PostgreSQL (Prisma)') deps.push('"@prisma/client": "^5.9.1"');
                if (discordConfig.soul === 'music') deps.push('"riffy": "^1.0.0"');
                if (discordConfig.soul === 'ai') {
                    if (discordConfig.moduleConfig.provider === 'Gemini') deps.push('"@google/generative-ai": "^0.2.1"');
                    if (discordConfig.moduleConfig.provider === 'OpenAI') deps.push('"openai": "^4.26.0"');
                }
                if (discordConfig.webBridge) deps.push('"express": "^4.18.2"', '"@types/express": "^4.17.21"');

                const data = { 
                    projectName: project.name, 
                    extraIntents, 
                    soul: discordConfig.soul.toUpperCase(), 
                    dependencies: deps.join(',\n    '),
                    webBridgeImport: discordConfig.webBridge ? (discordConfig.language === 'ts' ? "import { startWebBridge } from './utils/webBridge';" : "import { startWebBridge } from './utils/webBridge.js';") : "",
                    webBridgeStart: discordConfig.webBridge ? "startWebBridge(this);" : ""
                };

                await processTemplate('package.json.template', data);
                // Handle different index file extension
                await processTemplate(`src/index.${discordConfig.language}.template`, data); 
                // Wait, I named it index.js.template in JS dir, and index.ts.template in TS dir? Yes.
                // But I should check if I missed renaming index.ts.template in TS dir? No, it was index.ts.template.

                // .env Generation using EnvManager
                await generateEnvFile(targetDir, 'discord', discordConfig);

                // Docker Cleanup
                if (!discordConfig.docker) {
                    await fs.remove(path.join(targetDir, 'Dockerfile'));
                    await fs.remove(path.join(targetDir, 'docker-compose.yml'));
                }

                // Generate README.md
                const readme = generateReadme({
                    projectName: project.name,
                    projectType: 'discord',
                    language: discordConfig.language,
                    soul: discordConfig.soul,
                    extras: discordConfig.selectedExtras,
                    db: discordConfig.db,
                    docker: discordConfig.docker,
                    webBridge: discordConfig.webBridge
                });
                await fs.writeFile(path.join(targetDir, 'README.md'), readme);

                // Setup Git files
                await setupGitFiles(targetDir, 'discord', {
                    language: discordConfig.language,
                    docker: discordConfig.docker
                });

                // Setup testing framework
                if (discordConfig.testFramework && discordConfig.testFramework !== 'none') {
                    await setupTestingFiles(targetDir, discordConfig.testFramework, discordConfig.language);
                }

                // Setup CI/CD templates
                if (discordConfig.cicd && discordConfig.cicd !== 'none') {
                    const cicdTemplateFile = discordConfig.cicd === 'github' ? 'github-actions.yml' : 'gitlab-ci.yml';
                    const cicdTemplatePath = path.join(__dirname, 'templates', 'ci', cicdTemplateFile);
                    const cicdTargetDir = discordConfig.cicd === 'github' 
                        ? path.join(targetDir, '.github', 'workflows')
                        : targetDir;
                    const cicdTargetFile = discordConfig.cicd === 'github' 
                        ? 'ci.yml'
                        : '.gitlab-ci.yml';
                    
                    await fs.ensureDir(cicdTargetDir);
                    await fs.copy(cicdTemplatePath, path.join(cicdTargetDir, cicdTargetFile));
                    printInfo(`${discordConfig.cicd === 'github' ? 'GitHub Actions' : 'GitLab CI'} template added`);
                }

            } else if (project.type === 'express') {
                const templateDir = path.join(__dirname, 'templates', 'api', 'express');
                await fs.copy(templateDir, targetDir);
                
                // Simple template processing for package.json
                const pkgPath = path.join(targetDir, 'package.json.template');
                if (await fs.pathExists(pkgPath)) {
                    let content = await fs.readFile(pkgPath, 'utf8');
                    content = content.replace('{{projectName}}', project.name);
                    await fs.writeFile(path.join(targetDir, 'package.json'), content);
                    await fs.remove(pkgPath);
                }

                // Generate README.md
                const readme = generateReadme({
                    projectName: project.name,
                    projectType: 'express'
                });
                await fs.writeFile(path.join(targetDir, 'README.md'), readme);

                // Setup Git files
                await setupGitFiles(targetDir, 'express', { docker: false });
            }

            // Execute afterGenerate plugin hooks
            await pluginManager.executeHook('afterGenerate', { project, discordConfig, expressConfig }, targetDir);

            // Initialize Git if not disabled
            if (options.git !== false) {
                await initializeGit(targetDir, {
                    autoInit: true,
                    initialCommit: `Initial commit: ${project.name}`,
                    branch: 'main'
                });
            }

            spinner.succeed(chalk.green('VeloKit Project Built Successfully!'));

            // Dependencies
            if (options.install !== false) {
                console.log(chalk.gray(`\n  ${getRandomTip()}\n`));
                const installSpinner = ora(chalk.hex(BRAND_AQUA)(`Installing dependencies using ${project.packageManager}...`)).start();
                try {
                    const execa = (await import('execa')).default;
                    await execa(project.packageManager, ['install'], { cwd: targetDir });
                    installSpinner.succeed(chalk.green('Dependencies Synchronized!'));
                } catch (err) {
                    installSpinner.warn(chalk.yellow('Dependency installation skipped. Run manually.'));
                }
            }

            // Enhanced Success Screen
            console.log('\n');
            printSuccess('BUILD COMPLETE');
            
            printBox('PROJECT DETAILS', [
                `${chalk.hex(BRAND_AQUA)('Project:')}   ${project.name}`,
                `${chalk.hex(BRAND_AQUA)('Type:')}      ${project.type === 'discord' ? `Discord Bot (${discordConfig.language?.toUpperCase()})` : 'Express API'}`,
                ...(project.type === 'discord' && discordConfig.soul ? [
                    `${chalk.hex(BRAND_AQUA)('Focus:')}     ${discordConfig.soul.charAt(0).toUpperCase() + discordConfig.soul.slice(1)}`
                ] : []),
                ...(project.type === 'discord' && discordConfig.selectedExtras?.length > 0 ? [
                    `${chalk.hex(BRAND_AQUA)('Modules:')}   ${discordConfig.selectedExtras.length} extra feature(s)`
                ] : []),
                `${chalk.hex(BRAND_AQUA)('Location:')} ${targetDir}`
            ]);

            console.log(chalk.hex(BRAND_AQUA).bold('\n  📋 Next Steps:\n'));
            console.log(chalk.white(`    1. ${chalk.bold.cyan(`cd ${project.name}`)}`));
            
            if (project.type === 'discord') {
                console.log(chalk.white(`    2. ${chalk.bold('Add your tokens to .env file:')}`));
                console.log(chalk.gray(`       • DISCORD_TOKEN=your_bot_token`));
                if (discordConfig.soul === 'music') {
                    console.log(chalk.gray(`       • LAVALINK_* credentials`));
                } else if (discordConfig.soul === 'ai') {
                    console.log(chalk.gray(`       • AI_API_KEY for ${discordConfig.moduleConfig?.provider || 'your provider'}`));
                }
                console.log(chalk.white(`    3. ${chalk.bold.cyan(`${project.packageManager} run dev`)}`));
            } else {
                console.log(chalk.white(`    2. ${chalk.bold.cyan(`${project.packageManager} run dev`)}`));
            }

            console.log(chalk.hex(BRAND_AQUA).bold('\n  💡 Quick Tips:\n'));
            if (project.type === 'discord') {
                console.log(chalk.gray(`    • Commands are in ${chalk.white('src/commands/')}`));
                console.log(chalk.gray(`    • Events auto-load from ${chalk.white('src/events/')}`));
                console.log(chalk.gray(`    • The handler system makes adding features easy`));
            } else {
                console.log(chalk.gray(`    • Routes are in ${chalk.white('routes/')}`));
                console.log(chalk.gray(`    • Server runs on ${chalk.white('http://localhost:3000')}`));
            }

            console.log(chalk.hex(BRAND_AQUA).bold('\n  📖 Useful Resources:\n'));
            console.log(chalk.gray(`    • Documentation: ${chalk.cyan('https://velokit.sploov.xyz')}`));
            if (project.type === 'discord') {
                console.log(chalk.gray(`    • Discord.js Guide: ${chalk.cyan('https://discordjs.guide')}`));
                if (discordConfig.soul === 'music') {
                    console.log(chalk.gray(`    • Lavalink Setup: ${chalk.cyan('https://velokit.sploov.xyz/guide/module-music')}`));
                } else if (discordConfig.soul === 'ai') {
                    console.log(chalk.gray(`    • AI Module Guide: ${chalk.cyan('https://velokit.sploov.xyz/guide/module-ai')}`));
                }
            }
            console.log(chalk.gray(`    • Support Server: ${chalk.cyan('https://discord.gg/sploov')}`));

            console.log(chalk.hex(BRAND_AQUA).bold('\n  🌟 Support VeloKit:\n'));
            console.log(chalk.gray(`    • Star us on GitHub: ${chalk.cyan('https://github.com/sploov-xyz/velokit')}`));
            console.log(chalk.gray(`    • Share with your developer friends!`));

            console.log('\n' + chalk.gray('─'.repeat(60)));
            console.log(`${chalk.italic.hex(BRAND_AQUA)('Built with ❤️  by Sploov Team')}  ${chalk.gray('•')}  ${chalk.gray(`v${VERSION}`)}\n`);

        } catch (err) {
            spinner.fail(chalk.red('Build failed!'));
            printError(`An error occurred during build:\n  ${err}`);
            console.error(err);
            process.exit(1);
        }
    });

// --- New Commands ---

// Migrate command
program
    .command('migrate')
    .description('Migrate an existing VeloKit project to the latest version')
    .argument('[project-dir]', 'Project directory to migrate', process.cwd())
    .action(async (projectDir) => {
        printBanner(VERSION);
        await migrateProject(projectDir, VERSION);
    });

// Health check command
program
    .command('health')
    .description('Run health check on a VeloKit project')
    .argument('[project-dir]', 'Project directory to check', process.cwd())
    .action(async (projectDir) => {
        printBanner(VERSION);
        await checkProjectHealth(projectDir);
        await generateHealthReport(projectDir);
    });

// Plugin command
program
    .command('plugin')
    .description('Manage VeloKit plugins')
    .argument('<action>', 'Action: create, list')
    .argument('[name]', 'Plugin name (for create action)')
    .action(async (action, name) => {
        printBanner(VERSION);
        
        if (action === 'create') {
            if (!name) {
                printError('Plugin name is required');
                process.exit(1);
            }
            const pluginsDir = path.join(process.cwd(), '.velokit', 'plugins');
            await fs.ensureDir(pluginsDir);
            await createPluginScaffold(name, pluginsDir);
        } else if (action === 'list') {
            const pluginManager = new PluginManager();
            await pluginManager.loadPlugins();
            const plugins = pluginManager.getPlugins();
            
            if (plugins.length === 0) {
                printInfo('No plugins installed');
            } else {
                printBox('INSTALLED PLUGINS', plugins.map(p => 
                    `${chalk.cyan(p.name)} ${chalk.gray(`v${p.version}`)}${p.description ? `\n  ${chalk.gray(p.description)}` : ''}`
                ));
            }
        } else {
            printError(`Unknown action: ${action}`);
        }
    });

// Init git command
program
    .command('init-git')
    .description('Initialize git repository in an existing project')
    .argument('[project-dir]', 'Project directory', process.cwd())
    .option('-r, --remote <url>', 'Git remote URL')
    .option('-b, --branch <name>', 'Default branch name', 'main')
    .action(async (projectDir, options) => {
        printBanner(VERSION);
        await initializeGit(projectDir, {
            autoInit: true,
            initialCommit: 'Initial commit',
            remoteUrl: options.remote,
            branch: options.branch
        });
    });

// Add testing command
program
    .command('add-tests')
    .description('Add testing framework to an existing project')
    .argument('[project-dir]', 'Project directory', process.cwd())
    .option('-f, --framework <framework>', 'Testing framework (jest or vitest)', 'jest')
    .option('-l, --language <language>', 'Language (ts or js)', 'ts')
    .action(async (projectDir, options) => {
        printBanner(VERSION);
        await setupTestingFiles(projectDir, options.framework, options.language);
        printSuccess(`${options.framework} testing framework added successfully!`);
    });

program.parse(process.argv);