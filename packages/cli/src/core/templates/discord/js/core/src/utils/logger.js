import chalk from 'chalk';

export class Logger {
    static timestamp() {
        return chalk.gray(`${new Date().toLocaleTimeString()}`);
    }

    static info(message) {
        console.log(`${this.timestamp()} ${chalk.blue('ℹ')} ${message}`);
    }

    static success(message) {
        console.log(`${this.timestamp()} ${chalk.green('✔')} ${message}`);
    }

    static warn(message) {
        console.log(`${this.timestamp()} ${chalk.yellow('⚠')} ${message}`);
    }

    static error(message, error) {
        console.log(`${this.timestamp()} ${chalk.red('✖')} ${message}`);
        if (error) console.error(error);
    }

    static sploov(message) {
        console.log(`${this.timestamp()} ${chalk.hex('#26d0ce').bold('⚡')} ${chalk.hex('#26d0ce')(message)}`);
    }
}
