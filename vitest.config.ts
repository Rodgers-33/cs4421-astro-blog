import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['cdk/**', 'node_modules/**']
  },
});
