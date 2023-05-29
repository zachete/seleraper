import chalk from 'chalk';
export class OutputService {
    printGreen(coloredMessage, otherMessage) {
        console.log(chalk.bgGreen(coloredMessage), otherMessage);
    }
    printGray(coloredMessage, otherMessage) {
        console.log(chalk.gray(coloredMessage), otherMessage);
    }
}
