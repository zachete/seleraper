import { container } from 'container.js';
import { TYPES } from 'types.js';
import { App } from 'app.js';

export const main = async () => {
  const app = container.get<App>(TYPES.App);
  app.start();
};

main();
