import { Container } from 'inversify';
import { TYPES } from './types.js';
import 'reflect-metadata';
import { MainController } from './controllers/main.controller.js';
import { DefaultOutputService, } from './services/output/output.service.js';
import { DefaultScrapService, } from './services/scrap/scrap.service.js';
import { DefaultBrowserService, } from './services/browser/browser.service.js';
import { DefaultArgsService, } from './services/args/args.service.js';
const container = new Container();
container
    .bind(TYPES.MainController)
    .to(MainController)
    .inSingletonScope();
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
export default container;
