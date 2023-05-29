import chalk from 'chalk';

export class OutputService {
  printGreen(coloredMessage: string, otherMessage: string) {
    console.log(chalk.bgGreen(coloredMessage), otherMessage);
  }

  printGray(coloredMessage: string, otherMessage: string) {
    console.log(chalk.bgGray(coloredMessage), otherMessage);
  }
}
