import cluster from 'cluster';
import { inject, injectable } from 'inversify';
import PQueue from 'p-queue';
import { TYPES } from 'types.js';
import { ArgsService } from 'services/args/args.service.js';
import { BrowserService } from 'services/browser/browser.service.js';
import { OutputService } from 'services/output/output.service.js';
import { ScrapService } from 'services/scrap/scrap.service.js';
import { Controller } from './controller.js';

@injectable()
export class SearchTagController implements Controller {
  constructor(
    @inject(TYPES.ScrapService) private scrapService: ScrapService,
    @inject(TYPES.ArgsService) private argsService: ArgsService,
    @inject(TYPES.OutputService) private outputService: OutputService,
    @inject(TYPES.BrowserService) private browserService: BrowserService
  ) {}

  start() {
    this.outputService.showSpinner('Preparing');

    const pQueue = new PQueue({ concurrency: 1 });
    let pageNumber = 1;

    pQueue.on('empty', () => {
      this.outputService.printGray('ENDING', 'Pages queue is empty.');
      process.exit();
    });

    cluster.fork().on('message', (message) => {
      if (message.type === 'chunk') {
        const { chunk, full } = message.data;

        chunk.map(async (url: string) => {
          await pQueue.add(async () => {
            this.outputService.showSpinner(
              `Checking page ${pageNumber}/${full.length}`
            );

            const result = await this.scrapService.findSelector({
              url,
              selector: this.argsService.getArg('selector') as string,
            });

            if (result) {
              this.outputService.printGreen('FOUNDED', `on ${url}`);
            } else {
              this.outputService.printGray('NOT FOUND', `on ${url}`);
            }

            pageNumber++;
          });
        });
      }
    });

    process.on('SIGINT', async () => {
      await this.browserService.closeBrowser();
      process.exit();
    });
  }
}
