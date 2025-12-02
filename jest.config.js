module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  extensionsToTreatAsEsm: ['.ts'], // Treat TypeScript files as ES modules
  globals: {
    'ts-jest': {
      useESM: true, // Enable ESM support
    },
  },
  testPathIgnorePatterns: ['2024'],
};
