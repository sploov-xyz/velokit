import chalk from 'chalk';

export class Logger {
    private static timestamp(): string {
        return chalk.gray(`${new Date().toLocaleTimeString()}`);
    }

    static info(message: string) {
        console.log(`${this.timestamp()} ${chalk.blue('ℹ')} ${message}`);
    }

    static success(message: string) {
        console.log(`${this.timestamp()} ${chalk.green('✔')} ${message}`);
    }

    static warn(message: string) {
        console.log(`${this.timestamp()} ${chalk.yellow('⚠')} ${message}`);
    }

    static error(message: string, error?: any) {
        console.log(`${this.timestamp()} ${chalk.red('✖')} ${message}`);
        if (error) console.error(error);
    }

    static sploov(message: string) {
        console.log(`${this.timestamp()} ${chalk.hex('#26d0ce').bold('⚡')} ${chalk.hex('#26d0ce')(message)}`);
    }
}
