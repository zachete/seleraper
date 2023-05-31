import container from './inversify.config.js';
import { TYPES } from './types.js';
const main = async () => {
    const appService = container.get(TYPES.AppService);
    await appService.start();
};
main();
