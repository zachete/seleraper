import { Container } from 'inversify';
import { TYPES } from './types.js';
import 'reflect-metadata';
import { DefaultOutputService, } from './services/output/output.service.js';
import { DefaultAppService } from './services/app/app.service.js';
import { DefaultScrapService, } from './services/scrap/scrap.service.js';
import { DefaultBrowserService, } from './services/browser/browser.service.js';
const container = new Container();
container.bind(TYPES.AppService).to(DefaultAppService);
container.bind(TYPES.ScrapService).to(DefaultScrapService);
container.bind(TYPES.BrowserService).to(DefaultBrowserService);
container.bind(TYPES.OutputService).to(DefaultOutputService);
export default container;
