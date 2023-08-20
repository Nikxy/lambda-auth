import assert from "assert";

import response from "#utils/response.js";

const testData = { test: "test" };
const errorData = { error: "test" };

describe("util class response", () => {
	describe("generate", () => {
		it("should respond with specified status & data", async () => {
			const res = response.generate(200, testData);
			assert.equal(res.statusCode, 200);
			assert.deepEqual(res.body, testData);
		});
	});
	describe("OK", () => {
		it("should respond ok without data", async () => {
			const res = response.OK();
			assert.equal(res.statusCode, 200);
			assert.equal(res.body, null);
		});
		it("should respond ok with data", async () => {
			const res = response.OK(testData);
			assert.equal(res.statusCode, 200);
			assert.deepEqual(res.body, testData);
		});
	});
	describe("BadRequest", () => {
		it("should respond 400 without data", async () => {
			const res = response.BadRequest();
			assert.equal(res.statusCode, 400);
			assert.equal(res.body, null);
		});
		it("should respond 400 with error data", async () => {
			const res = response.BadRequest(errorData.error);
			assert.equal(res.statusCode, 400);
			assert.deepEqual(res.body, errorData);
		});
	});
	describe("ServerError", () => {
		it("should respond 500 without data", async () => {
			const res = response.ServerError();
			assert.equal(res.statusCode, 500);
			assert.equal(res.body, null);
		});
		it("should respond 500 with error data", async () => {
			const res = response.ServerError(errorData.error);
			assert.equal(res.statusCode, 500);
			assert.deepEqual(res.body, errorData);
		});
	});
});