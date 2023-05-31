import container from './inversify.config.js';
import { AppService } from './services/app/app.service';
import { TYPES } from './types.js';

const main = async () => {
  const appService = container.get<AppService>(TYPES.AppService);

  await appService.start();
};

main();
