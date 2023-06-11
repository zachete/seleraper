import _ from 'lodash';
import { inject, injectable } from 'inversify';
import { TYPES } from 'types.js';
import { prepareUrl } from 'utils/prepare-url.js';
import { BrowserService } from 'services/browser/browser.service.js';

export abstract class ScrapService {
  abstract scrapLinks(options: RunOptions): Promise<RunResult>;
  abstract findSelector(options: FindSelectorOptions): Promise<boolean>;
}
@injectable()
export class DefaultScrapService implements ScrapService {
  private scrapExcludes: string[] = [];
  private hostname: string = null;
  private urls: string[] = [];

  constructor(
    @inject(TYPES.BrowserService) private browserService: BrowserService
  ) {}

  async scrapLinks({ url: rawUrl }: RunOptions) {
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

  async findSelector({ url, selector }: FindSelectorOptions) {
    const browser = await this.browserService.getBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector('body');
    const result = !!(await page.$$eval(selector, (items) => items.length));
    await page.close();
    return result;
  }

  processLinks(links: string[]) {
    // TODO: check for refactor
    return _.uniq(
      links
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
        })
    );
  }
}

export interface RunOptions {
  url: string;
}

export interface RunResult {
  chunk: string[];
  full: string[];
}

export interface FindSelectorOptions {
  url: string;
  selector: string;
}
