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

const veloGradient = gradient(['#00FFFF', '#8000FF', '#FF00FF']);

export function printBanner() {
    console.clear();
    const width = process.stdout.columns || 80;
    const padding = Math.max(0, Math.floor((width - 55) / 2));
    const padStr = ' '.repeat(padding);

    console.log('\n');
    ASCII_ART.split('\n').forEach(line => {
        if (line.trim()) console.log(padStr + chalk.bold(veloGradient.multiline(line)));
    });
    console.log(padStr + chalk.italic.gray('                     > Powered by Sploov\n'));
    console.log(chalk.gray('\u2500'.repeat(width)) + '\n');
}

export function printSection(title: string) {
    console.log(`\n${chalk.cyan.bold('◆')} ${chalk.white.bold(title.toUpperCase())}`);
    console.log(chalk.gray('  ' + '\u2500'.repeat(20)));
}

export function printBox(content: string[]) {
    const width = 50;
    const horizontalLine = chalk.magenta('╭' + '\u2500'.repeat(width - 2) + '╮');
    const bottomLine = chalk.magenta('╰' + '\u2500'.repeat(width - 2) + '╯');
    
    console.log(horizontalLine);
    content.forEach(line => {
        const padding = width - 4 - line.replace(/\u001b\[.*?m/g, '').length;
        console.log(chalk.magenta('│ ') + chalk.white(line) + ' '.repeat(Math.max(0, padding)) + chalk.magenta(' │'));
    });
    console.log(bottomLine);
}

export async function typewriter(text: string, speed = 30) {
    for (const char of text) {
        process.stdout.write(chalk.cyan(char));
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    process.stdout.write('\n');
}