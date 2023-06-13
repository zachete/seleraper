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
import cluster from 'cluster';
import { inject, injectable } from 'inversify';
import PQueue from 'p-queue';
import { TYPES } from '../types.js';
import { ArgsService } from '../services/args/args.service.js';
import { BrowserService } from '../services/browser/browser.service.js';
import { OutputService } from '../services/output/output.service.js';
import { ScrapService } from '../services/scrap/scrap.service.js';
// Time, that controller will wait, if pages queue is empty.
// Else, exit process.
const EXIT_TIMEOUT = 20000;
// For now, the queue concurrency is 1, because higer values
// starts many browser instances and i'm not sure, that is for positive scrapping performance
const QUEUE_CONCURRENCY = 1;
let SearchTagController = class SearchTagController {
    constructor(scrapService, argsService, outputService, browserService) {
        this.scrapService = scrapService;
        this.argsService = argsService;
        this.outputService = outputService;
        this.browserService = browserService;
    }
    start() {
        this.outputService.showSpinner('Preparing');
        const pQueue = new PQueue({ concurrency: QUEUE_CONCURRENCY });
        let exitTimeout;
        pQueue.on('empty', () => {
            exitTimeout = setTimeout(() => {
                this.outputService.printGray('ENDING', `Pages queue is empty by ${EXIT_TIMEOUT}.`);
                process.exit();
            }, EXIT_TIMEOUT);
        });
        let pageNumber = 1;
        cluster.fork().on('message', (message) => {
            if (message.type === 'chunk') {
                if (exitTimeout) {
                    clearTimeout(exitTimeout);
                }
                const { chunk, full } = message.data;
                chunk.map(async (url) => {
                    await pQueue.add(async () => {
                        this.outputService.showSpinner(`Checking page ${pageNumber}/${full.length}`);
                        const result = await this.scrapService.findSelector({
                            url,
                            selector: this.argsService.getArg('selector'),
                        });
                        if (result) {
                            this.outputService.printGreen('FOUNDED', `on ${url}`);
                        }
                        else {
                            this.outputService.printGray('NOT FOUND', `on ${url}`);
                        }
                        pageNumber++;
                    });
                });
            }
        });
        process.on('SIGINT', async () => {
            await this.browserService.closeBrowser();
            process.exit();
        });
    }
};
SearchTagController = __decorate([
    injectable(),
    __param(0, inject(TYPES.ScrapService)),
    __param(1, inject(TYPES.ArgsService)),
    __param(2, inject(TYPES.OutputService)),
    __param(3, inject(TYPES.BrowserService)),
    __metadata("design:paramtypes", [ScrapService,
        ArgsService,
        OutputService,
        BrowserService])
], SearchTagController);
export { SearchTagController };
