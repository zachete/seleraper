var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import puppeteer from 'puppeteer';
export class BrowserService {
}
let DefaultBrowserService = class DefaultBrowserService {
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
};
DefaultBrowserService = __decorate([
    injectable()
], DefaultBrowserService);
export { DefaultBrowserService };
