import async from 'async';
import { BrowserService } from './services/browser.service.js';
import { ScrapService } from './services/scrap.service.js';
import { ArgsService } from './services/args.service.js';

const main = async () => {
  const argsService = new ArgsService();
  const browserService = new BrowserService();
  const browser = await browserService.getBrowser();
  const scrapService = new ScrapService(browser);
  const args = argsService.getArgs();

  const queue = async.queue<string>(async (url, completed) => {
    await scrapService.run({
      url,
      selector: args.values.selector,
      next: (nextUrl: string) => {
        queue.push(nextUrl);
      },
    });
    console.log('completed', completed);
    completed();
  }, 4);

  queue.push(args.values.url, (error) => {
    console.error('Error', error);
  });
};

main();
