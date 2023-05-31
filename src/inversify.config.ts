import { Container } from 'inversify';
import { TYPES } from './types.js';
import 'reflect-metadata';
import {
  OutputService,
  DefaultOutputService,
} from './services/output/output.service.js';
import { AppService, DefaultAppService } from './services/app/app.service.js';
import {
  ScrapService,
  DefaultScrapService,
} from './services/scrap/scrap.service.js';
import {
  BrowserService,
  DefaultBrowserService,
} from './services/browser/browser.service.js';

const container = new Container();

container.bind<AppService>(TYPES.AppService).to(DefaultAppService);
container.bind<ScrapService>(TYPES.ScrapService).to(DefaultScrapService);
container.bind<BrowserService>(TYPES.BrowserService).to(DefaultBrowserService);
container.bind<OutputService>(TYPES.OutputService).to(DefaultOutputService);

export default container;
