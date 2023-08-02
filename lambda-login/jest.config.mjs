/** @returns {Promise<import('jest').Config>} */
export default async () => {
  return {
    verbose: true,
    testEnvironment: "node",
    testMatch: ["**/*.test.mjs"],
    setupFiles: ["<rootDir>/__tests__/jest.setup.mjs"],
    coveragePathIgnorePatterns: [ "/node_modules/" ],
    moduleDirectories: ["node_modules", "__dirname"]
  };
};
