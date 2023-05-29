import puppeteer from 'puppeteer';
export class BrowserService {
    async getBrowser() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
        });
        return browser;
    }
}
