import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types.js';
import { Router } from './router.js';
import { DefaultOutputService, } from './services/output/output.service.js';
import { DefaultScrapService, } from './services/scrap/scrap.service.js';
import { DefaultBrowserService, } from './services/browser/browser.service.js';
import { DefaultArgsService } from './services/args/args.service.js';
import { SearchTagController } from './controllers/search-tag.controller.js';
import { ScrapLinksController } from './controllers/scrap-links.controller.js';
const container = new Container();
container.bind(TYPES.Router).to(Router);
container
    .bind(TYPES.SearchTagController)
    .to(SearchTagController);
container
    .bind(TYPES.ScrapLinksController)
    .to(ScrapLinksController);
container
    .bind(TYPES.ArgsService)
    .to(DefaultArgsService)
    .inSingletonScope();
container.bind(TYPES.ScrapService).to(DefaultScrapService);
container
    .bind(TYPES.BrowserService)
    .to(DefaultBrowserService)
    .inSingletonScope();
container
    .bind(TYPES.OutputService)
    .to(DefaultOutputService)
    .inSingletonScope();
export { container };
