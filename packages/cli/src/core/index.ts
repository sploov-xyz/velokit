#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { printBanner, printSection, printBox, typewriter } from './utils/branding';

const VERSION = '1.0.0';
const program = new Command();

program
    .name('velokit')
    .description('The Ultimate Discord Bot Scaffolder by Sploov')
    .version(VERSION);

program
    .action(async () => {
        printBanner();
        await typewriter('Initializing the Forge engine...');
        console.log('');

        // --- Identity ---
        printSection('Identity');
        const basics = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: chalk.white('Project Name:'),
                default: 'my-velokit-bot',
                validate: (input) => /^([a-z0-9-_])+$/.test(input) || 'Invalid project name'
            },
            {
                type: 'password',
                name: 'botToken',
                message: chalk.white('Discord Bot Token (optional):'),
                mask: chalk.magenta('*')
            },
            {
                type: 'list',
                name: 'packageManager',
                message: chalk.white('Package Manager:'),
                choices: ['pnpm', 'npm', 'yarn'],
                default: 'pnpm'
            }
        ]);

        // --- Core ---
        printSection('Core Architecture');
        const core = await inquirer.prompt([
            {
                type: 'list',
                name: 'soul',
                message: chalk.white('Select Bot Focus:'),
                choices: [
                    { name: chalk.cyan('Music') + ' (Lavalink/NodeLink)', value: 'music' },
                    { name: chalk.cyan('AI') + ' (Gemini/Groq/OpenAI)', value: 'ai' },
                    { name: chalk.cyan('Moderation') + ' & Management', value: 'mod' },
                    { name: chalk.cyan('Economy') + ' & Games', value: 'economy' }
                ]
            }
        ]);

        // --- Engine Deep-Dive ---
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

        // --- Extras ---
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

        // --- Infrastructure ---
        printSection('Infrastructure');
        const infra = await inquirer.prompt([
            {
                type: 'list',
                name: 'db',
                message: chalk.white('Primary Database:'),
                choices: ['MongoDB (Mongoose)', 'PostgreSQL (Prisma)', 'None'],
                default: 'MongoDB (Mongoose)'
            },
            { type: 'confirm', name: 'docker', message: chalk.white('Generate Docker Files?'), default: false }
        ]);

        // --- Final Summary ---
        console.log('\n');
        printBox([
            chalk.cyan.bold('      FORGE CONFIGURATION      '),
            chalk.gray('─'.repeat(46)),
            `${chalk.magenta('Name:')}    ${basics.projectName}`,
            `${chalk.magenta('Soul:')}    ${core.soul.toUpperCase()}`,
            `${chalk.magenta('DB:')}      ${infra.db}`,
            `${chalk.magenta('Modules:')} ${extras.selectedExtras.length || 'None'}`
        ]);
        console.log('');

        const confirm = await inquirer.prompt([{ type: 'confirm', name: 'proceed', message: chalk.cyan.bold('Begin the forge?'), default: true }]);
        if (!confirm.proceed) process.exit(0);

        // --- Assembly ---
        console.log('');
        const spinner = ora({
            text: chalk.cyan('Forging VeloKit architecture...'),
            color: 'magenta'
        }).start();

        try {
            const targetDir = path.join(process.cwd(), basics.projectName);
            const templateDir = path.join(__dirname, 'templates', 'core');

            await fs.ensureDir(targetDir);
            await fs.copy(templateDir, targetDir);

            // Process Templates
            const processTemplate = async (file: string, data: any) => {
                const filePath = path.join(targetDir, file);
                if (await fs.pathExists(filePath)) {
                    let content = await fs.readFile(filePath, 'utf8');
                    for (const key in data) content = content.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
                    await fs.writeFile(filePath.replace('.template', ''), content);
                    if (filePath.endsWith('.template')) await fs.remove(filePath);
                }
            };

            const extraIntents = (core.soul === 'music' ? 'GatewayIntentBits.GuildVoiceStates, ' : '') + 
                                (extras.selectedExtras.includes('extra_mod') ? 'GatewayIntentBits.GuildMembers, ' : '');

            const data = { projectName: basics.projectName, extraIntents, soul: core.soul.toUpperCase(), db: infra.db };
            await processTemplate('package.json.template', data);
            await processTemplate('src/index.ts.template', data);
            await processTemplate('README.md.template', data);

            // Copy Modules
            const modules = [core.soul, ...extras.selectedExtras];
            for (const mod of modules) {
                const modDir = path.join(__dirname, 'templates', 'modules', mod);
                if (await fs.pathExists(modDir)) await fs.copy(modDir, targetDir, { overwrite: true });
            }

            // Docker cleanup
            if (!infra.docker) {
                await fs.remove(path.join(targetDir, 'Dockerfile'));
                await fs.remove(path.join(targetDir, 'docker-compose.yml'));
            }

            // .env
            let env = `DISCORD_TOKEN=${basics.botToken}\nMONGODB_URI=\nOWNER_ID=\n`;
            if (core.soul === 'music') env += `LAVALINK_HOST=${moduleConfig.host}\nLAVALINK_PORT=${moduleConfig.port}\nLAVALINK_PASS=${moduleConfig.password}\n`;
            else if (core.soul === 'ai') env += `AI_API_KEY=${moduleConfig.apiKey}\nAI_PROVIDER=${moduleConfig.provider}\n`;
            await fs.writeFile(path.join(targetDir, '.env'), env);

            spinner.succeed(chalk.green('VeloKit Bot Forged Successfully!'));

            // Phase 7: Finalization
            const installSpinner = ora(chalk.magenta(`Installing dependencies using ${basics.packageManager}...`)).start();
            
            try {
                const { execa } = await import('execa');
                await execa(basics.packageManager, ['install'], { cwd: targetDir });
                installSpinner.succeed(chalk.green('Dependencies Synchronized!'));
            } catch (err) {
                installSpinner.warn(chalk.yellow('Dependency installation skipped or failed.'));
            }

            console.log('\n' + chalk.gray('─'.repeat(50)));
            console.log(chalk.cyan.bold('CONSTRUCTION COMPLETE'));
            console.log(chalk.white(`Path:    ${targetDir}`));
            console.log(chalk.white(`Command: cd ${basics.projectName} && ${basics.packageManager} run dev`));
            console.log(chalk.gray('─'.repeat(50)));
            console.log(`\n${chalk.italic.magenta('Powered by Sploov Team\n')}`);

        } catch (err) {
            spinner.fail(chalk.red('Forge failed!'));
            console.error(err);
        }
    });

program.parse(process.argv);
