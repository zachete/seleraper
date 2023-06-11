import container from './container.js';
import { TYPES } from './types.js';
export const main = async () => {
    const mainController = container.get(TYPES.MainController);
    await mainController.start();
};
main();
