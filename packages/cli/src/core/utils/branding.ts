import chalk from 'chalk';
import gradient from 'gradient-string';

export const ASCII_ART = `
 ██╗   ██╗███████╗██╗      ██████╗ ██╗  ██╗██╗████████╗
 ██║   ██║██╔════╝██║     ██╔═══██╗██║ ██╔╝██║╚══██╔══╝
 ██║   ██║█████╗  ██║     ██║   ██║█████╔╝ ██║   ██║   
 ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═██╗ ██║   ██║   
  ╚████╔╝ ███████╗███████╗╚██████╔╝██║  ██╗██║   ██║   
   ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝   
`;

const veloGradient = gradient(['#1a2980', '#26d0ce']);
const primaryColor = chalk.hex('#26d0ce');

export function printBanner(version?: string) {
    console.clear();
    const width = process.stdout.columns || 80;
    const padding = Math.max(0, Math.floor((width - 55) / 2));
    const padStr = ' '.repeat(padding);

    console.log('\n');
    ASCII_ART.split('\n').forEach(line => {
        if (line.trim()) console.log(padStr + chalk.bold(veloGradient.multiline(line)));
    });
    
    const verStr = version ? `v${version}` : '';
    console.log(padStr + chalk.italic.gray(`                     > Powered by Sploov ${verStr}\n`));
    console.log(chalk.gray('\u2500'.repeat(width)) + '\n');
}

export function printSection(title: string, step?: string) {
    const displayTitle = step ? `${step} • ${title}` : title;
    console.log(`\n${primaryColor('▐')} ${chalk.bold.white(displayTitle.toUpperCase())}`);
    console.log(chalk.gray('  ' + '\u2500'.repeat(30)));
}

export function printBox(title: string, content: string[]) {
    const width = 50;
    const horizontalLine = primaryColor('─'.repeat(width - 2));
    const topBorder = primaryColor('╭') + horizontalLine + primaryColor('╮');
    const bottomBorder = primaryColor('╰') + horizontalLine + primaryColor('╯');
    
    console.log(topBorder);
    const titlePadding = Math.floor((width - title.length - 2) / 2);
    console.log(primaryColor('│') + ' '.repeat(titlePadding) + chalk.bold.white(title) + ' '.repeat(width - title.length - 2 - titlePadding) + primaryColor('│'));
    console.log(primaryColor('│') + chalk.gray('─'.repeat(width - 2)) + primaryColor('│'));

    content.forEach(line => {
        const stripped = line.replace(/\u001b\[.*?m/g, '');
        const padding = width - 4 - stripped.length;
        console.log(primaryColor('│ ') + line + ' '.repeat(Math.max(0, padding)) + primaryColor(' │'));
    });
    console.log(bottomBorder);
}

export function printSuccess(message: string) {
    const width = 50;
    console.log('');
    console.log(chalk.green('  ' + '✔'.repeat(3)));
    console.log(`  ${chalk.bold.green(message)}`);
    console.log(chalk.gray('  ' + '\u2500'.repeat(width)));
}

export async function typewriter(text: string, speed = 25) {
    process.stdout.write(primaryColor('  ► '));
    for (const char of text) {
        process.stdout.write(primaryColor(char));
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    process.stdout.write('\n');
}

export function printWarning(message: string) {
    console.log('');
    console.log(chalk.hex('#f59e0b')('  ⚠ ') + chalk.bold.hex('#f59e0b')('WARNING'));
    console.log(chalk.gray('  ' + '\u2500'.repeat(30)));
    console.log(`  ${chalk.hex('#f59e0b')(message)}`);
    console.log('');
}

export function printInfo(message: string) {
    console.log('');
    console.log(chalk.hex('#3b82f6')('  ℹ ') + chalk.bold.hex('#3b82f6')('INFO'));
    console.log(chalk.gray('  ' + '\u2500'.repeat(30)));
    console.log(`  ${chalk.hex('#3b82f6')(message)}`);
    console.log('');
}

export function printError(message: string) {
    console.log('');
    console.log(chalk.hex('#ef4444')('  ✖ ') + chalk.bold.hex('#ef4444')('ERROR'));
    console.log(chalk.gray('  ' + '\u2500'.repeat(30)));
    console.log(`  ${chalk.hex('#ef4444')(message)}`);
    console.log('');
}

export function printList(items: string[], title?: string) {
    if (title) {
        console.log('\n' + primaryColor('  ► ') + chalk.bold.white(title));
    }
    items.forEach((item) => {
        console.log(chalk.gray('    • ') + chalk.white(item));
    });
    console.log();
}

export function printTree(obj: any, indent: string = '  ') {
    Object.entries(obj).forEach(([key, value], index, arr) => {
        const isLast = index === arr.length - 1;
        const prefix = isLast ? '└─ ' : '├─ ';
        const connector = isLast ? '   ' : '│  ';
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            console.log(chalk.gray(indent + prefix) + primaryColor(key));
            printTree(value, indent + connector);
        } else if (Array.isArray(value)) {
            console.log(chalk.gray(indent + prefix) + primaryColor(key) + chalk.gray(': ') + chalk.white(value.join(', ')));
        } else {
            console.log(chalk.gray(indent + prefix) + primaryColor(key) + chalk.gray(': ') + chalk.white(value));
        }
    });
}

export function printProgressBar(current: number, total: number, width: number = 30) {
    const percentage = Math.round((current / total) * 100);
    const filled = Math.round((width * current) / total);
    const empty = width - filled;
    
    const bar = primaryColor('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
    console.log(`\n  ${bar} ${chalk.bold.white(`${percentage}%`)} ${chalk.gray(`(${current}/${total})`)}`);
}