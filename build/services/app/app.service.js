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
import { inject, injectable } from 'inversify';
import Queue from 'better-queue';
import { TYPES } from '../../types.js';
import { ScrapService } from '../scrap/scrap.service.js';
export class AppService {
}
// TODO: make and use args service instead
const MOCK_URL = 'https://www.urallawoolroom.com.au/';
const MOCK_SELECTOR = 'div[class^=elfsight-app]';
let DefaultAppService = class DefaultAppService {
    constructor(scrapService) {
        this.scrapService = scrapService;
    }
    async start() {
        await this.scrapService.init();
        const q = new Queue(async (url, cb) => {
            await this.scrapService.run({
                url,
                selector: MOCK_SELECTOR,
                next: (nextUrl) => {
                    q.push(nextUrl);
                },
            });
            cb(null, true);
        }, {
            concurrent: 8,
        });
        q.push(MOCK_URL);
    }
};
DefaultAppService = __decorate([
    injectable(),
    __param(0, inject(TYPES.ScrapService)),
    __metadata("design:paramtypes", [ScrapService])
], DefaultAppService);
export { DefaultAppService };
