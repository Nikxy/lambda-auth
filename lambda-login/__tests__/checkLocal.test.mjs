import {jest} from '@jest/globals'
import checkLocal from "../utils/checkLocal";

describe("util function checkLocal", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("shouldn't change config if local endpoint wasn't provided", async () => {
    const config = {};

    if (process.env.LOCAL_ENDPOINT) delete process.env.LOCAL_ENDPOINT;

    checkLocal(config);
    expect(config.endpoint).toBe(undefined);
  });
  it("should add local endpoint to config if provided", async () => {
    const config = {};
    process.env.LOCAL_ENDPOINT = "http://test";
    checkLocal(config);

    expect(config.endpoint).toBe("http://test");
  });

  //process.env.LOCAL_ENDPOINT
});
