import assert from "assert";
import loadAuthToken from "#utils/loadAuthToken.js";

describe("[util] function loadAuthToken", () => {
    it("Should respond invalid token if it's not Bearer token", async () => {
        const tokenData = "test";
        assert.throws(() => {
            loadAuthToken(tokenData);
        }, Error("Invalid token"));
    });
    it("Should respond invalid token if it's not valid jwt", async () => {
        const tokenData = "Bearer test";
        assert.throws(() => {
            loadAuthToken(tokenData);
        }, Error("Invalid token"));
    });

    it("Should respond invalid token if it's not valid jwt", async () => {
        const tokenData = "Bearer asdsad.saddas.asdd";
        assert.throws(() => {
            loadAuthToken(tokenData);
        }, Error("Invalid token"));
    });

    it("Should respond with data in token", async () => {
        const tokenData = "Bearer asdsad.eyJ1c2VybmFtZSI6InRlc3QifQ==.asdd";
        const jwt = tokenData.split(" ")[1];
        const data = loadAuthToken(tokenData);
        assert.equal(data.username, "test");
        assert.equal(data.jwt, jwt);
    });
});