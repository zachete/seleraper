var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import { parseArgs } from 'util';
const DEFAULT_URL = 'https://example.com';
const DEFAULT_SELECTOR = 'p';
export class ArgsService {
}
let DefaultArgsService = class DefaultArgsService {
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
                },
            });
        }
        return this.args.values;
    }
    getArg(name) {
        const args = this.getArgs();
        return args[name];
    }
};
DefaultArgsService = __decorate([
    injectable()
], DefaultArgsService);
export { DefaultArgsService };
