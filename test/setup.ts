import { rm } from 'fs/promises';
import { join } from 'path';

// Remove test database before each e2e test
global.beforeEach(async () => {
  await rm(join(__dirname, '..', 'test-db.sqlite')).catch(() => null);
});
