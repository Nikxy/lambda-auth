/** @returns {Promise<import('jest').Config>} */
export default async () => {
  return {
    verbose: true,
    testEnvironment: "node",
    testMatch: ["**/*.test.mjs"],
  };
};
