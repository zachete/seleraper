import { injectable } from 'inversify';
import { parseArgs } from 'util';

const DEFAULT_URL = 'https://example.com';
const DEFAULT_SELECTOR = 'p';

export abstract class ArgsService {
  abstract getArgs(): ParseArgsResult['values'];
  abstract getArg(name: string): ArgValue;
}

@injectable()
export class DefaultArgsService implements ArgsService {
  private args: ParseArgsResult;

  getArgs() {
    if (!this.args) {
      this.args = parseArgs({
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
          help: {
            type: 'boolean',
            short: 'h',
            default: false,
          },
        },
      });
    }

    return this.args.values;
  }

  getArg(name: string) {
    const args = this.getArgs();
    return args[name];
  }
}

export type ArgValue = undefined | string | boolean | Array<string | boolean>;

export interface ParseArgsResult {
  values: {
    [options: string]: ArgValue;
  };
  positionals: string[];
  tokens?: unknown;
}
