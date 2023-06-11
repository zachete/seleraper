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
import { TYPES } from '../../types.js';
import { prepareUrl } from '../../utils/prepare-url.js';
import { BrowserService } from '../../services/browser/browser.service.js';
export class ScrapService {
}
let DefaultScrapService = class DefaultScrapService {
    constructor(browserService) {
        this.browserService = browserService;
        this.scrapExcludes = [];
        this.hostname = null;
        this.urls = [];
    }
    async scrapLinks({ url: rawUrl }) {
        const url = prepareUrl(rawUrl);
        const browser = await this.browserService.getBrowser();
        if (!this.hostname) {
            const urlObj = new URL(url);
            this.hostname = urlObj.hostname;
        }
        if (this.scrapExcludes.includes(url)) {
            return;
        }
        this.scrapExcludes.push(url);
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitForSelector('body');
        const links = await page.$$eval('a', (items) => {
            return items.map((item) => item.href);
        });
        await page.close();
        links.push(url);
        const processedLinks = this.processLinks(links) || [];
        const result = _.difference(processedLinks, this.urls);
        this.urls = this.urls.concat(result);
        return {
            chunk: result,
            full: this.urls,
        };
    }
    async findSelector({ url, selector }) {
        const browser = await this.browserService.getBrowser();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitForSelector('body');
        const result = !!(await page.$$eval(selector, (items) => items.length));
        await page.close();
        return result;
    }
    processLinks(links) {
        // TODO: need refactor
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
    __metadata("design:paramtypes", [BrowserService])
], DefaultScrapService);
export { DefaultScrapService };
