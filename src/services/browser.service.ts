import puppeteer from 'puppeteer';

export class BrowserService {
  async getBrowser() {
    const browser = await puppeteer.launch({
      args: ['--disable-setuid-sandbox'],
      // TODO: make this param optional
      ignoreHTTPSErrors: true,
    });

    return browser;
  }
}
