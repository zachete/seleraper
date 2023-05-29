import { URL } from 'node:url';
import async from 'async';
import { startBrowser } from './browser';
import { EventEmitter } from 'node:stream';
const scrapped = [];
const stopList = [];
const siteURL = new URL('https://www.expat-u.com/');
let browserInstance;
let queue;
let scrapEmitter = new EventEmitter();
const scrap = async (link) => {
    if (scrapped.includes(link) || stopList.includes(link)) {
        return;
    }
    try {
        const page = await browserInstance.newPage();
        await page.goto(link);
        await page.waitForSelector('body > div');
        const links = await page.$$eval('a', (links) => {
            return links.map((item) => item.href);
        });
        const hasWidget = await page.$$eval('[class^="elfsight-app"]', (items) => items.length);
        console.log(hasWidget ? '+++' : '-', link);
        links.map((item) => {
            scrapEmitter.emit('scrap', item);
        });
    }
    catch (e) {
        console.log(e, link);
        stopList.push(link);
        queue.pause();
        setTimeout(() => {
            queue.unshift(link);
            queue.resume();
        }, 5000);
    }
};
const main = async () => {
    browserInstance = await startBrowser();
    queue = async.queue(async (url, completed) => {
        await scrap(url);
        completed();
    }, 4);
    scrapEmitter.on('scrap', (url) => {
        queue.push(url);
    });
    scrapEmitter.emit('scrap', siteURL.href);
};
main();
