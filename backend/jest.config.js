module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      "^.+\\.ts$": "ts-jest",  // Add ts-jest transformer for TypeScript files
    },
    moduleFileExtensions: ['ts', 'js'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    testMatch: ['**/?(*.)+(spec|test).[t]s'],  // Match test files with .ts extension
  };
  