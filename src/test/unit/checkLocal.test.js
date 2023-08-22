import assert from "assert";
import checkLocal from "#utils/checkLocal.js";

const testUrl = "http://test";
const OLD_ENV = process.env;


describe("util function checkLocal", () => {
	before(() => {
		process.env = { ...OLD_ENV }; // Make a copy
	});
	after(() => {
		process.env = OLD_ENV; // Restore old environment
	});
	it("shouldn't change config if local endpoint wasn't provided", async () => {
		const config = {};

		if (process.env.LOCAL_ENDPOINT) delete process.env.LOCAL_ENDPOINT;

		checkLocal(config);
    assert.equal(config.endpoint,undefined);
	});
	it("should add local endpoint to config if provided", async () => {
		const config = {};
		process.env.LOCAL_ENDPOINT = testUrl;
		checkLocal(config);

    assert.equal(config.endpoint,testUrl);
	});
});
