import { container } from './container.js';
import { TYPES } from './types.js';
export const main = async () => {
    const router = container.get(TYPES.Router);
    await router.start();
};
main();
