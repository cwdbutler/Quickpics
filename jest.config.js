module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  collectCoverage: true,
  testEnvironment: "./prisma/test-environment.ts",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};
