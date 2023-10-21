import fetch from "node-fetch";
import { expect, assert } from "chai";
import { describe, it } from "mocha";

describe("Login Fail Test", () => {
	const baseUrl = "http://localhost:3000/login";
	const baseRequest = {
		method: "POST",
		headers: {
			Accept: "application/json,*/*",
			"Content-Type": "application/json",
		},
	};
	it("respond bad request with json body containing error message", async () => {
		var response = await fetch(baseUrl, baseRequest);
		expect(response.status).to.equal(400);

		expect(response.headers.get("Content-Type")).to.equal(
			"application/json"
		);
		try {
			var object = await response.json();
			expect(object).to.be.an("object");
			expect(object).to.have.property("message");
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message);
		}
	});
	it("request all data", async () => {
		var response = await fetch(baseUrl, {
			...baseRequest,
			body: JSON.stringify({
				username: "invalid",
				password: "invalid",
			}),
		});
		expect(response.status).to.equal(400);
		var object = await response.json();
		expect(object.message).to.satisfy((string) =>
			["domain", "username", "password"].every((bit) =>
				string.includes(bit)
			)
		);
	});
	it("responds invalid domain", async () => {
		var response = await fetch(baseUrl, {
			...baseRequest,
			body: JSON.stringify({
				domain: "invalid",
				username: "invalid",
				password: "invalid",
			}),
		});
		expect(response.status).to.equal(400);
		var json = await response.text();
		let object;
		try {
			object = JSON.parse(json);
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message + " | " + json);
		}
		expect(object.message).to.equal("Invalid domain");
	});
	it("responds invalid user/pass", async () => {
		if(!process.env.TEST_DOMAIN)
			assert.fail("TEST_DOMAIN env not set");
		var response = await fetch(baseUrl, {
			...baseRequest,
			body: JSON.stringify({
				domain: process.env.TEST_DOMAIN.trim(),
				username: "invalid",
				password: "invalid",
			}),
		});
		expect(response.status).to.equal(400);
		var json = await response.text();
		let object;
		try {
			object = JSON.parse(json);
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message + " | " + json);
		}
		expect(object.message).to.equal("Invalid username or password");
	});
	it("responds invalid user/pass", async () => {
		if(!process.env.TEST_DOMAIN)
			assert.fail("TEST_DOMAIN env not set");
			if(!process.env.TEST_USERNAME)
			assert.fail("TEST_USERNAME env not set");
		var response = await fetch(baseUrl, {
			...baseRequest,
			body: JSON.stringify({
				domain: process.env.TEST_DOMAIN.trim(),
				username: process.env.TEST_USERNAME.trim(),
				password: "invalid",
			}),
		});
		expect(response.status).to.equal(400);
		var json = await response.text();
		let object;
		try {
			object = JSON.parse(json);
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message + " | " + json);
		}
		expect(object.message).to.equal("Invalid username or password");
	});
});