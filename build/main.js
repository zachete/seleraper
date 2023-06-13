import { container } from './container.js';
import { TYPES } from './types.js';
export const main = async () => {
    const app = container.get(TYPES.App);
    app.start();
};
main();
