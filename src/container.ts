import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from 'types.js';
import { App } from 'app.js';
import {
  OutputService,
  DefaultOutputService,
} from 'services/output/output.service.js';
import {
  ScrapService,
  DefaultScrapService,
} from 'services/scrap/scrap.service.js';
import {
  BrowserService,
  DefaultBrowserService,
} from 'services/browser/browser.service.js';
import { ArgsService, DefaultArgsService } from 'services/args/args.service.js';
import { SearchTagController } from 'controllers/search-tag.controller.js';
import { ScrapLinksController } from 'controllers/scrap-links.controller.js';

const container = new Container();

container.bind<App>(TYPES.App).to(App);
container
  .bind<SearchTagController>(TYPES.SearchTagController)
  .to(SearchTagController);
container
  .bind<ScrapLinksController>(TYPES.ScrapLinksController)
  .to(ScrapLinksController);
container
  .bind<ArgsService>(TYPES.ArgsService)
  .to(DefaultArgsService)
  .inSingletonScope();
container.bind<ScrapService>(TYPES.ScrapService).to(DefaultScrapService);
container
  .bind<BrowserService>(TYPES.BrowserService)
  .to(DefaultBrowserService)
  .inSingletonScope();
container
  .bind<OutputService>(TYPES.OutputService)
  .to(DefaultOutputService)
  .inSingletonScope();

export { container };
