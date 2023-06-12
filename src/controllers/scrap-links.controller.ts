import { inject, injectable } from 'inversify';
import Queue from 'better-queue';
import { TYPES } from 'types.js';
import { ArgsService } from 'services/args/args.service.js';
import { BrowserService } from 'services/browser/browser.service.js';
import { OutputService } from 'services/output/output.service.js';
import { ScrapService } from 'services/scrap/scrap.service.js';
import { Controller } from './controller.js';

@injectable()
export class ScrapLinksController implements Controller {
  constructor(
    @inject(TYPES.ScrapService) private scrapService: ScrapService,
    @inject(TYPES.ArgsService) private argsService: ArgsService,
    @inject(TYPES.OutputService) private outputService: OutputService,
    @inject(TYPES.BrowserService) private browserService: BrowserService
  ) {}

  start() {
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

    process.on('SIGINT', async () => {
      await this.browserService.closeBrowser();
      process.exit();
    });
  }
}
