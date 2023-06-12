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
import { TYPES } from '../types.js';
import { ArgsService } from '../services/args/args.service.js';
import { BrowserService } from '../services/browser/browser.service.js';
import { OutputService } from '../services/output/output.service.js';
import { ScrapService } from '../services/scrap/scrap.service.js';
let ScrapLinksController = class ScrapLinksController {
    constructor(scrapService, argsService, outputService, browserService) {
        this.scrapService = scrapService;
        this.argsService = argsService;
        this.outputService = outputService;
        this.browserService = browserService;
    }
    start() {
        const queue = new Queue(async (url, cb) => {
            const result = await this.scrapService.scrapLinks({
                url,
            });
            if (result) {
                const { chunk, full } = result;
                process.send({
                    type: 'chunk',
                    data: {
                        chunk,
                        full,
                    },
                });
                chunk.map((url) => queue.push(url));
            }
            cb(null, true);
        }, {
            concurrent: 8,
        });
        const entryUrl = this.argsService.getArg('url');
        queue.push(entryUrl);
        process.on('SIGINT', async () => {
            await this.browserService.closeBrowser();
            process.exit();
        });
    }
};
ScrapLinksController = __decorate([
    injectable(),
    __param(0, inject(TYPES.ScrapService)),
    __param(1, inject(TYPES.ArgsService)),
    __param(2, inject(TYPES.OutputService)),
    __param(3, inject(TYPES.BrowserService)),
    __metadata("design:paramtypes", [ScrapService,
        ArgsService,
        OutputService,
        BrowserService])
], ScrapLinksController);
export { ScrapLinksController };
