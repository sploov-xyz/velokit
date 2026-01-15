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

export function printSection(title: string) {
    console.log(`\n${primaryColor('▐')} ${chalk.bold.white(title.toUpperCase())}`);
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