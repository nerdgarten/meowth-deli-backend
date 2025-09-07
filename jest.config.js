export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/generated/**/*",
    "!src/__tests__/**/*",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
