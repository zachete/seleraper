import _ from 'lodash';
import { prepareUrl } from '../utils/prepare-url.js';
import container from '../inversify.config.js';
import { TYPES } from '../types.js';
export class ScrapService {
    constructor(browser) {
        this.scrapExcludes = [];
        this.hostname = null;
        this.browser = browser;
        this.outputService = container.get(TYPES.OutputService);
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
}
