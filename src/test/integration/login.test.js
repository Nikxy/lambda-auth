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
	it ("OPTIONS cors headers", async () => {
		var response = await fetch(baseUrl, {...baseRequest, method: "OPTIONS"});
		expect(response.status).to.equal(200);

		expect(response.headers).to.include.members([
			"access-control-allow-headers",
			"access-control-allow-methods",
			"access-control-allow-origin",
		]);
	});
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
		try{
			var object = JSON.parse(json);
			expect(object.message).to.equal("Invalid Domain");
		}
		catch(e){
			assert.fail("Invalid JSON: " + e.message + " | " + json);
		}
		
	});
});

//process.env.TEST_DOMAIN
