import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { injectable } from 'inversify';

// TODO: Refactor to use more flexible way to colorize text

export abstract class OutputService {
  abstract printGreen(coloredMessage: string, message: string): void;
  abstract printGray(coloredMessage: string, message?: string): void;
  abstract printRed(coloredMessage: string, message?: string): void;
  abstract error(message: string): void;
  abstract showSpinner(text: string): void;
  abstract hideSpinner(): void;
}

@injectable()
export class DefaultOutputService implements OutputService {
  private spinner: Ora;

  printGreen(coloredMessage: string, message: string) {
    this.hideSpinner();
    console.log(chalk.green(coloredMessage), message);
  }

  printGray(coloredMessage: string, message?: string) {
    this.hideSpinner();
    console.log(chalk.grey(coloredMessage), message);
  }

  printRed(coloredMessage: string, message: string) {
    this.hideSpinner();
    console.log(chalk.red(coloredMessage), message);
  }

  error(message: string) {
    this.printRed('ERROR', message);
  }

  showSpinner(text: string) {
    if (this.spinner) {
      this.spinner.stop();
    }

    this.spinner = ora({
      text,
      spinner: 'bouncingBar',
    });
    this.spinner.start();
  }

  hideSpinner() {
    if (this.spinner) {
      this.spinner.stop();
    }
  }
}
