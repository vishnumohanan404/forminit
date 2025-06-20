// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  testMatch: ["**/?(*.)+(spec|test).[t]s"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
