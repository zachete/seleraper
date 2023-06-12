import { inject, injectable } from 'inversify';
import cluster from 'cluster';
import { TYPES } from 'types.js';
import { ScrapLinksController } from 'controllers/scrap-links.controller.js';
import { SearchTagController } from 'controllers/search-tag.controller.js';
import { ArgsService } from 'services/args/args.service.js';

@injectable()
export class Router {
  constructor(
    @inject(TYPES.ScrapLinksController)
    private scrapLinksController: ScrapLinksController,
    @inject(TYPES.SearchTagController)
    private searchTagController: SearchTagController,
    @inject(TYPES.ArgsService) private argsService: ArgsService
  ) {}

  start() {
    // TODO: add help section

    if (cluster.isPrimary) {
      this.searchTagController.start();
    } else {
      this.scrapLinksController.start();
    }
  }
}
