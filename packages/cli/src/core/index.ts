#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { printBanner, printSection, printBox, typewriter, printSuccess } from './utils/branding';

const VERSION = '1.0.1';
const program = new Command();

const BRAND_AQUA = '#26d0ce';
const BRAND_BLUE = '#1a2980';

program
    .name('velokit')
    .description('The Ultimate Project Scaffolder by Sploov')
    .version(VERSION);

program
    .action(async () => {
        printBanner(VERSION);
        await typewriter('Initializing VeloKit Build Engine...');
        console.log('');

        // --- Project Type Selection ---
        printSection('Project Initialization');
        const project = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: chalk.white('Select Project Type:'),
                choices: [
                    { name: 'Discord Bot', value: 'discord' },
                    { name: `Express API (REST) ${chalk.hex(BRAND_AQUA).bold('[NEW]')}`, value: 'express' },
                    { name: chalk.gray('Web App (React) - Coming Soon'), value: 'react', disabled: 'In Development' }
                ]
            },
            {
                type: 'input',
                name: 'name',
                message: chalk.white('Project Name:'),
                default: (answers: any) => answers.type === 'discord' ? 'my-velokit-bot' : 'my-velokit-api',
                validate: (input) => /^([a-z0-9-_])+$/.test(input) || 'Invalid project name'
            },
            {
                type: 'list',
                name: 'packageManager',
                message: chalk.white('Package Manager:'),
                choices: ['pnpm', 'npm', 'yarn'],
                default: 'pnpm'
            }
        ]);

        let discordConfig: any = {};
        let expressConfig: any = {};

        // --- Discord Logic ---
        if (project.type === 'discord') {
            printSection('Bot Identity');
            const identity = await inquirer.prompt([
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

            printSection('Core Architecture');
            const core = await inquirer.prompt([
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
                printSection('Engine Configuration');
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

            printSection('Additional Modules');
            const extras = await inquirer.prompt([
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

            printSection('Infrastructure');
            const infra = await inquirer.prompt([
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

            discordConfig = { ...identity, ...core, moduleConfig, ...extras, ...infra };
        }

        // --- Confirmation ---
        console.log('\n');
        printBox('BUILD CONFIGURATION', [
            `${chalk.hex(BRAND_AQUA)('Type:')}    ${project.type.toUpperCase()}`,
            `${chalk.hex(BRAND_AQUA)('Name:')}    ${project.name}`,
            ...(project.type === 'discord' ? [
                `${chalk.hex(BRAND_AQUA)('Lang:')}    ${discordConfig.language.toUpperCase()}`,
                `${chalk.hex(BRAND_AQUA)('Soul:')}    ${discordConfig.soul.toUpperCase()}`
            ] : [])
        ]);

        const confirm = await inquirer.prompt([{ type: 'confirm', name: 'proceed', message: chalk.hex(BRAND_AQUA).bold('Start Build?'), default: true }]);
        if (!confirm.proceed) process.exit(0);

        // --- Construction ---
        console.log('');
        const spinner = ora({
            text: chalk.hex(BRAND_AQUA)('Constructing architecture...'),
            color: 'cyan'
        }).start();

        try {
            const targetDir = path.join(process.cwd(), project.name);
            await fs.ensureDir(targetDir);

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

                // .env Generation
                let env = `DISCORD_TOKEN=${discordConfig.token}\nMONGODB_URI=\nOWNER_ID=\n`;
                if (discordConfig.soul === 'music') env += `LAVALINK_HOST=${discordConfig.moduleConfig.host}\nLAVALINK_PORT=${discordConfig.moduleConfig.port}\nLAVALINK_PASS=${discordConfig.moduleConfig.password}\n`;
                else if (discordConfig.soul === 'ai') env += `AI_API_KEY=${discordConfig.moduleConfig.apiKey}\nAI_PROVIDER=${discordConfig.moduleConfig.provider}\n`;
                await fs.writeFile(path.join(targetDir, '.env'), env);

                // Docker Cleanup
                if (!discordConfig.docker) {
                    await fs.remove(path.join(targetDir, 'Dockerfile'));
                    await fs.remove(path.join(targetDir, 'docker-compose.yml'));
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
            }

            spinner.succeed(chalk.green('VeloKit Project Built Successfully!'));

            // Dependencies
            const installSpinner = ora(chalk.hex(BRAND_AQUA)(`Installing dependencies using ${project.packageManager}...`)).start();
            try {
                const execa = (await import('execa')).default;
                await execa(project.packageManager, ['install'], { cwd: targetDir });
                installSpinner.succeed(chalk.green('Dependencies Synchronized!'));
            } catch (err) {
                installSpinner.warn(chalk.yellow('Dependency installation skipped. Run manually.'));
            }

            printSuccess('BUILD COMPLETE');
            console.log(chalk.white(`  Path:    ${targetDir}`));
            console.log(chalk.white(`  Command: cd ${project.name} && ${project.packageManager} run dev`));
            console.log(chalk.gray('\u2500'.repeat(50)));
            console.log(`\n${chalk.italic.hex(BRAND_AQUA)('Powered by Sploov Team\n')}`);

        } catch (err) {
            spinner.fail(chalk.red('Build failed!'));
            console.error(err);
        }
    });

program.parse(process.argv);