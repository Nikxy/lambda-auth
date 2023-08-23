import fetch from "node-fetch";
import { expect, assert } from "chai";

describe("Login Testing", () => {
	const baseUrl = "http://localhost:3000/login";
	const baseRequest = {
		method: "POST",
		headers: {
			Accept: "application/json,*/*",
			"Content-Type": "application/json",
		},
	};
	it("check if responds bad request with json body containing error message", async () => {
		var response = await fetch(baseUrl, baseRequest);
		expect(response.status).to.equal(400);

		expect(response.headers.get("Content-Type")).to.equal(
			"application/json"
		);
		try {
			var json = await response.json();
			expect(json).to.be.an("object");
			expect(json).to.have.property("message");
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message);
		}
	});
	it("check if asks for all data", async () => {
		var response = await fetch(baseUrl, {
			...baseRequest,
			body: JSON.stringify({
				username: "invalid",
				password: "invalid",
			}),
		});
		expect(response.status).to.equal(400);
		var json = await response.json();
		expect(json.message).to.satisfy((string) =>
			["domain", "username", "password"].every((bit) =>
				string.includes(bit)
			)
		);
	});
	it("check if responds invalid domain", async () => {
		var response = await fetch(baseUrl, {
			...baseRequest,
			body: JSON.stringify({
				domain: "invalid",
				username: "invalid",
				password: "invalid",
			}),
		});
		var json = await response.json();
		expect(json.message).to.equal("Invalid Domain");
	});

	it("[login]", async () => {});
});

//process.env.TEST_DOMAIN