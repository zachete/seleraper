import { injectable } from 'inversify';
import puppeteer, { Browser } from 'puppeteer';

export abstract class BrowserService {
  abstract getBrowser(): Promise<Browser>;
  abstract closeBrowser(): Promise<void>;
}

@injectable()
export class DefaultBrowserService implements BrowserService {
  private browser: Browser;

  async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
      });
    }

    return this.browser;
  }

  async closeBrowser() {
    if (!this.browser) {
      return;
    }

    await this.browser.close();
  }
}
