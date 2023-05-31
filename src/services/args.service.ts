import { parseArgs } from 'util';

// TODO: Wrap into a service

const DEFAULT_URL = 'https://example.com';
const DEFAULT_SELECTOR = 'p';

export class ArgsService {
  getArgs() {
    return parseArgs({
      options: {
        url: {
          type: 'string',
          short: 'u',
          default: DEFAULT_URL,
        },
        selector: {
          type: 'string',
          short: 's',
          default: DEFAULT_SELECTOR,
        },
      },
    });
  }
}
