import { inject, injectable } from 'inversify';
import cluster from 'cluster';
import { TYPES } from 'types.js';
import { ScrapLinksController } from 'controllers/scrap-links.controller.js';
import { SearchTagController } from 'controllers/search-tag.controller.js';
import { ArgsService } from 'services/args/args.service.js';
import { OutputService } from 'services/output/output.service.js';

@injectable()
export class App {
  constructor(
    @inject(TYPES.ScrapLinksController)
    private scrapLinksController: ScrapLinksController,
    @inject(TYPES.SearchTagController)
    private searchTagController: SearchTagController,
    @inject(TYPES.ArgsService) private argsService: ArgsService,
    @inject(TYPES.OutputService) private outputService: OutputService
  ) {}

  start() {
    if (this.argsService.getArg('help')) {
      this.printHelp();
      return;
    }

    if (cluster.isPrimary) {
      this.searchTagController.start();
    } else {
      this.scrapLinksController.start();
    }
  }

  private printHelp() {
    console.log(`
Usage: serper -u <siteUrl> -s <selector>
-u, --url <siteURL>\tEntry point, from where serper will start scrapping site pages;
-s, --selector <selector> Query selector to find them. Maybe iframe[src=https://example.com], div[class=example], etc.
    `);
  }
}
