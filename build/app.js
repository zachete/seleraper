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
import cluster from 'cluster';
import { TYPES } from './types.js';
import { ScrapLinksController } from './controllers/scrap-links.controller.js';
import { SearchTagController } from './controllers/search-tag.controller.js';
import { ArgsService } from './services/args/args.service.js';
let App = class App {
    constructor(scrapLinksController, searchTagController, argsService) {
        this.scrapLinksController = scrapLinksController;
        this.searchTagController = searchTagController;
        this.argsService = argsService;
    }
    start() {
        // TODO: add help section
        if (this.argsService.getArg('help')) {
            this.printHelp();
            return;
        }
        if (cluster.isPrimary) {
            this.searchTagController.start();
        }
        else {
            this.scrapLinksController.start();
        }
    }
    printHelp() {
        console.log(`
Usage: serper -u <siteUrl> -s <selector>
-u, --url <siteURL>\tEntry point, from where serper will start scrapping site pages;
-s, --selector <selector> Query selector to find them. Maybe iframe[src=https://example.com], div[class=example], etc.
    `);
    }
};
App = __decorate([
    injectable(),
    __param(0, inject(TYPES.ScrapLinksController)),
    __param(1, inject(TYPES.SearchTagController)),
    __param(2, inject(TYPES.ArgsService)),
    __metadata("design:paramtypes", [ScrapLinksController,
        SearchTagController,
        ArgsService])
], App);
export { App };
