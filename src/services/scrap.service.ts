import { Browser } from 'puppeteer';
import uniq from 'lodash/uniq.js';
import { OutputService } from './output.service.js';
import { prepareUrl } from '../utils/prepare-url.js';

export class ScrapService {
  private browser: Browser;
  private outputService: OutputService;
  private scrapExcludes: string[] = [];
  private hostname: string = null;

  constructor(browser: Browser) {
    this.browser = browser;
    this.outputService = new OutputService();
  }

  async run({ url: rawUrl, selector, next }: RunOptions) {
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
    } else {
      this.outputService.printGray('CHECKED', url);
    }

    const processedLinks = this.processLinks(links) || [];

    processedLinks.map((item) => {
      console.log(item);
      next(item);
    });
  }

  processLinks(links: string[]) {
    return uniq(links)
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
      });
  }
}

export interface RunOptions {
  url: string;
  selector: string;
  next: (url: string) => void;
}
