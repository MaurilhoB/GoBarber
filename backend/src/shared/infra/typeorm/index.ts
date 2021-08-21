import { createConnections } from 'typeorm';

(async () => {
  await createConnections();
})();
