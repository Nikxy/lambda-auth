import fetch from "node-fetch";
import { expect, assert } from "chai";
import { describe, it } from "mocha";

describe("Login Succeed", () => {
	const baseUrl = "http://localhost:3000/";
	let jwtStr = null;
	it("responds with token on right login", async () => {
		if (!process.env.TEST_DOMAIN) assert.fail("TEST_DOMAIN env not set");
		if (!process.env.TEST_USERNAME)
			assert.fail("TEST_USERNAME env not set");
		if (!process.env.TEST_PASSWORD)
			assert.fail("TEST_PASSWORD env not set");
		var response = await fetch(baseUrl + "login", {
			method: "POST",
			headers: {
				Accept: "application/json,*/*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				domain: process.env.TEST_DOMAIN,
				username: process.env.TEST_USERNAME,
				password: process.env.TEST_PASSWORD,
			}),
		});
		expect(response.status).to.equal(200);
		var json = await response.text();
		let object;
		try {
			object = JSON.parse(json);
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message + " | " + json);
		}
		expect(object.token).to.be.a("string");
		jwtStr = object.token;
	});
	it("jwt status should be valid and not expired", async () => {
		if (jwtStr == null) assert.fail("jwt was not set from previous test");

		var response = await fetch(baseUrl + "status", {
			headers: {
				Accept: "application/json,*/*",
				Authorization: "Bearer " + jwtStr,
			},
		});
		expect(response.status).to.equal(200);
		var json = await response.text();
		let object;
		try {
			object = JSON.parse(json);
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message + " | " + json);
		}
		expect(object.valid).to.equal(true);
		expect(object.expired).to.equal(false);
	});
	it("can refresh token", async () => {
		if (jwtStr == null) assert.fail("jwt was not set from previous test");

		var response = await fetch(baseUrl + "refresh", {
			headers: {
				Accept: "application/json,*/*",
				Authorization: "Bearer " + jwtStr,
			},
		});
		expect(response.status).to.equal(200);
		var json = await response.text();
		let object;
		try {
			object = JSON.parse(json);
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message + " | " + json);
		}
		expect(object.token).to.be.a("string");
		jwtStr = object.token;
	});
	it("refreshed jwt status should be valid and not expired", async () => {
		if (jwtStr == null) assert.fail("jwt was not set from previous test");

		var response = await fetch(baseUrl + "status", {
			headers: {
				Accept: "application/json,*/*",
				Authorization: "Bearer " + jwtStr,
			},
		});
		expect(response.status).to.equal(200);
		var json = await response.text();
		let object;
		try {
			object = JSON.parse(json);
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message + " | " + json);
		}
		expect(object.valid).to.equal(true);
		expect(object.expired).to.equal(false);
	});
});
