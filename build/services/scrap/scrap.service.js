var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import _ from 'lodash';
import { inject, injectable } from 'inversify';
import { prepareUrl } from '../../utils/prepare-url.js';
import { BrowserService } from '../browser/browser.service.js';
import { TYPES } from '../..//types.js';
import { OutputService } from '../output/output.service.js';
export class ScrapService {
}
let DefaultScrapService = class DefaultScrapService {
    constructor(browserService, outputService) {
        this.browserService = browserService;
        this.outputService = outputService;
        this.scrapExcludes = [];
        this.hostname = null;
    }
    async init() {
        this.browser = await this.browserService.createBrowser();
    }
    async run({ url: rawUrl, selector, next }) {
        const url = prepareUrl(rawUrl);
        if (!this.hostname) {
            const urlObj = new URL(url);
            this.hostname = urlObj.hostname;
        }
        if (this.scrapExcludes.includes(url)) {
            return;
        }
        this.scrapExcludes.push(url);
        const page = await this.browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitForSelector('body');
        const links = await page.$$eval('a', (items) => {
            return items.map((item) => item.href);
        });
        const hasSelector = await page.$$eval(selector, (items) => items.length);
        if (hasSelector) {
            this.outputService.printGreen('FOUNDED', url);
        }
        else {
            this.outputService.printGray('CHECKED', url);
        }
        const processedLinks = this.processLinks(links) || [];
        processedLinks.map((item) => next(item));
    }
    processLinks(links) {
        return _.uniq(links
            .map((item) => prepareUrl(item))
            .filter((item) => {
            const url = prepareUrl(item);
            if (!url) {
                return;
            }
            if (url.startsWith('tel:') || url.startsWith('mailto:')) {
                return;
            }
            const hostname = new URL(url).hostname;
            if (hostname && hostname !== this.hostname) {
                return;
            }
            return true;
        }));
    }
};
DefaultScrapService = __decorate([
    injectable(),
    __param(0, inject(TYPES.BrowserService)),
    __param(1, inject(TYPES.OutputService)),
    __metadata("design:paramtypes", [BrowserService,
        OutputService])
], DefaultScrapService);
export { DefaultScrapService };
