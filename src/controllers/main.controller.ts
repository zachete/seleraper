import { inject, injectable } from 'inversify';
import PQueue from 'p-queue';
import Queue from 'better-queue';
import cluster from 'cluster';
import { TYPES } from 'types.js';
import { ArgsService } from 'services/args/args.service.js';
import { ScrapService } from 'services/scrap/scrap.service.js';
import { OutputService } from 'services/output/output.service.js';
import { BrowserService } from 'services/browser/browser.service.js';

export abstract class Controller {
  abstract start(): void;
}

@injectable()
export class MainController implements Controller {
  constructor(
    @inject(TYPES.ScrapService) private scrapService: ScrapService,
    @inject(TYPES.ArgsService) private argsService: ArgsService,
    @inject(TYPES.OutputService) private outputService: OutputService,
    @inject(TYPES.BrowserService) private browserService: BrowserService
  ) {}

  async start() {
    // TODO: maybe split parallel logic to seperate controllers
    if (cluster.isPrimary) {
      this.handleSearch();
    } else {
      this.handleLinksScrapper();
    }

    process.on('SIGINT', async () => {
      await this.browserService.closeBrowser();
      this.exit();
    });
  }

  private handleSearch() {
    this.outputService.showSpinner('Preparing');

    const pQueue = new PQueue({ concurrency: 1 });
    let pageNumber = 1;

    pQueue.on('empty', () => {
      this.outputService.printGray('ENDING', 'Pages queue is empty.');
      this.exit();
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
  }

  private handleLinksScrapper() {
    const queue = new Queue(
      async (url: string, cb: (error: unknown, result: unknown) => void) => {
        const result = await this.scrapService.scrapLinks({
          url,
        });

        if (result) {
          const { chunk, full } = result;

          process.send({
            type: 'chunk',
            data: {
              chunk,
              full,
            },
          });

          chunk.map((url) => queue.push(url));
        }

        cb(null, true);
      },
      {
        concurrent: 8,
      }
    );

    const entryUrl = this.argsService.getArg('url') as string;
    queue.push(entryUrl);
  }

  private exit() {
    process.exit();
  }
}
