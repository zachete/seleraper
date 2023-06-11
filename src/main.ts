import container from 'container.js';
import { TYPES } from 'types.js';
import { MainController } from 'controllers/main.controller.js';

export const main = async () => {
  const mainController = container.get<MainController>(TYPES.MainController);

  await mainController.start();
};

main();
