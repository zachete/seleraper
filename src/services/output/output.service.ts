import chalk from 'chalk';
import { injectable } from 'inversify';

export abstract class OutputService {
  abstract printGreen(coloredMessage: string, otherMessage: string): void;
  abstract printGray(coloredMessage: string, otherMessage: string): void;
}

@injectable()
export class DefaultOutputService implements OutputService {
  printGreen(coloredMessage: string, otherMessage: string) {
    console.log(chalk.bgGreen(coloredMessage), otherMessage);
  }

  printGray(coloredMessage: string, otherMessage: string) {
    console.log(chalk.bgGray(coloredMessage), otherMessage);
  }
}
