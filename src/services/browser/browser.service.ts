import { injectable } from 'inversify';
import puppeteer, { Browser } from 'puppeteer';

export abstract class BrowserService {
  abstract createBrowser(): Promise<Browser>;
}

@injectable()
export class DefaultBrowserService implements BrowserService {
  private browser: Browser;

  async createBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        args: ['--disable-setuid-sandbox'],
        // TODO: make this param optional
        ignoreHTTPSErrors: true,
      });
    }

    return this.browser;
  }
}
