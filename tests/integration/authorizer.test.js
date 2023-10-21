import fetch from "node-fetch";
import { expect, assert } from "chai";
import { describe, it } from "mocha";

describe("Authorizer Test", () => {
	const baseUrl = "http://localhost:3000/auth";
	const baseRequest = {
		method: "GET",
		headers: {
			Accept: "application/json,*/*",
			"Content-Type": "application/json",
		},
	};
	it("respond 401 UNAUTHORIZED when no authorization header is sent", async () => {
		var response = await fetch(baseUrl, baseRequest);
		expect(response.status).to.equal(401);

		expect(response.headers.get("Content-Type")).to.equal(
			"application/json"
		);
		try {
			var object = await response.json();
			expect(object).to.be.an("object");
			expect(object).to.have.property("message");
            expect(object.message).to.equal("Unauthorized");
		} catch (e) {
			assert.fail("Invalid JSON: " + e.message);
		}
	});
	it("respond 403 FORBIDDEN when invalid auth token is sent", async () => {
        var response = await fetch(baseUrl, {
            ...baseRequest,
            headers: {
                ...baseRequest.headers,
                [process.env.AUTH_HEADER]: "invalid"
            }
        });
		
        expect(response.status).to.equal(403);

        var response = await fetch(baseUrl, {
            ...baseRequest,
            headers: {
                ...baseRequest.headers,
                [process.env.AUTH_HEADER]: "Bearer invalid"
            }
        });
		
        expect(response.status).to.equal(403);
	});
});