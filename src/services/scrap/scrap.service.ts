import _ from 'lodash';
import { inject, injectable } from 'inversify';
import { prepareUrl } from '../../utils/prepare-url.js';
import { BrowserService } from '../browser/browser.service.js';
import { TYPES } from '../../types.js';
import { OutputService } from '../output/output.service.js';

export abstract class ScrapService {
  abstract run(options: RunOptions): Promise<void>;
}

export interface RunOptions {
  url: string;
  selector: string;
  next: (url: string) => void;
}

@injectable()
export class DefaultScrapService implements ScrapService {
  private scrapExcludes: string[] = [];
  private hostname: string = null;

  constructor(
    @inject(TYPES.BrowserService) private browserService: BrowserService,
    @inject(TYPES.OutputService) private outputService: OutputService
  ) {}

  async run({ url: rawUrl, selector, next }: RunOptions) {
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

    const hasSelector = await page.$$eval(selector, (items) => items.length);

    if (hasSelector) {
      this.outputService.printGreen('FOUNDED', url);
    } else {
      this.outputService.printGray('CHECKED', url);
    }

    const processedLinks = this.processLinks(links) || [];

    processedLinks.map((item) => next(item));
  }

  processLinks(links: string[]) {
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
  selector: string;
  next: (url: string) => void;
}
