module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/coverage",
    "<rootDir>/dist",
  ],
  moduleDirectories: ["<rootDir>/node_modules", "<rootDir>/src"],
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
    "@pages/(.*)": "<rootDir>/src/pages/$1",
    "@styles/(.*)": "<rootDir>/src/styles/$1",
    "\\.(scss|sass|css)$": "identity-obj-proxy",
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
};
