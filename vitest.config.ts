import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: [
      // '**/2024/**',
      '**/node_modules/**',
    ],
  },
});
