import { container } from 'container.js';
import { TYPES } from 'types.js';
import { Router } from 'router';

export const main = async () => {
  const router = container.get<Router>(TYPES.Router);
  await router.start();
};

main();
