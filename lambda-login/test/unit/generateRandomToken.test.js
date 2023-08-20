import assert from "assert";
import generateRandomToken from "#utils/generateRandomToken.js";

describe("util function generateRandomToken", () => {
	it("should return 32 characters as default", async () => {
		const token = generateRandomToken();
		assert.equal(token.length, 32);
	});

	it("should return specified length of characters ", async () => {
		const token = generateRandomToken(64);
		assert.equal(token.length, 64);
	});

	it("should return even when odd length specified", async () => {
		const token = generateRandomToken(15);
		assert.equal(token.length, 14);
	});
});
