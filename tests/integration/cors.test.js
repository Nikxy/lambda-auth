import fetch from "node-fetch";
import { expect } from "chai";
import { describe, it } from "mocha";

describe("CORS headers test", () => {
	it("login OPTIONS cors headers", async () => {
		try {
			await checkCorsHeaders("login", "OPTIONS", ["POST", "OPTIONS"]);
		}
		catch (e) {
			await checkCorsHeaders("login", "OPTIONS", ["GET", "OPTIONS"]);
		}
	});
	it("login POST cors headers", async () => {
		try {
			await checkCorsHeaders("login", "OPTIONS", ["POST", "OPTIONS"]);
		}
		catch (e) {
			await checkCorsHeaders("login", "OPTIONS", ["GET", "OPTIONS"]);
		}
	});
    it("refresh OPTIONS cors headers", async () => {
		await checkCorsHeaders("refresh", "OPTIONS", ["GET", "OPTIONS"]);
	});
	it("refresh GET cors headers", async () => {
		await checkCorsHeaders("refresh", "GET", ["GET", "OPTIONS"]);
	});
    it("status OPTIONS cors headers", async () => {
		await checkCorsHeaders("status", "OPTIONS", ["GET", "OPTIONS"]);
	});
	it("status POST cors headers", async () => {
		await checkCorsHeaders("status", "GET", ["GET", "OPTIONS"]);
	});
});

const baseUrl = "http://localhost:3000/";

async function checkCorsHeaders(path, method, methodstoinclude) {
	var response = await fetch(baseUrl + path, {
		method: method,
		headers: {
			Accept: "application/json,*/*",
			"Content-Type": "application/json",
		},
	});
	if (method == "OPTIONS") expect(response.status).to.equal(200);

	expect(response.headers.get("access-control-allow-headers")).to.be.a(
		"string"
	);
	expect(
		response.headers.get("access-control-allow-headers")
	).to.contain.string("Content-Type");
	expect(response.headers.get("access-control-allow-methods")).to.be.a(
		"string"
	);
	const methods = response.headers
		.get("access-control-allow-methods")
		.split(",");
	expect(methods).to.include.members(methodstoinclude);
	expect(response.headers.get("access-control-allow-origin")).to.be.a(
		"string"
	);
	expect(response.headers.get("access-control-allow-origin")).to.equal("*");
}
