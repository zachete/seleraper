import { inject, injectable } from 'inversify';
import Queue from 'better-queue';
import { TYPES } from '../../types.js';
import { ScrapService } from '../scrap/scrap.service.js';

export abstract class AppService {
  abstract start(): Promise<void>;
}

// TODO: make and use args service instead
const MOCK_URL = 'https://www.urallawoolroom.com.au/';
const MOCK_SELECTOR = 'div[class^=elfsight-app]';

@injectable()
export class DefaultAppService implements AppService {
  constructor(@inject(TYPES.ScrapService) private scrapService: ScrapService) {}

  async start() {
    const q = new Queue(
      async (url: string, cb: (error: unknown, result: unknown) => void) => {
        await this.scrapService.run({
          url,
          selector: MOCK_SELECTOR,
          next: (nextUrl: string) => {
            q.push(nextUrl);
          },
        });

        cb(null, true);
      },
      {
        concurrent: 8,
      }
    );

    q.push(MOCK_URL);
  }
}
