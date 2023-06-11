import { Container } from 'inversify';
import { TYPES } from 'types.js';
import 'reflect-metadata';
import { MainController } from 'controllers/main.controller.js';
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

const container = new Container();

container
  .bind<MainController>(TYPES.MainController)
  .to(MainController)
  .inSingletonScope();
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

export default container;
