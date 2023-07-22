import response from "../utils/response";

describe('util/response', () => {

    test("response", async () => {
    const data = { test: "test" };
    const res = response.generate(200, data);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(data);
    }
);
test("responseEmptyOK", async () => {
    const res = response.generateEmptyOK();
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeNull();
    }
);
test("responseOK", async () => {
    const data = { test: "test" };
    const res = response.generateOK(data);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(JSON.stringify(data));
    }
);
test("responseBadRequest", async () => {
    const res = response.generateBadRequest();
    expect(res.statusCode).toBe(400);
    expect(res.body).toBeNull();
    }
);
test("responseBadRequest", async () => {
    const res = response.generateBadRequest("test");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "test" });
    }
);
test("responseServerError", async () => {
    const res = response.generateServerError("test");
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "test" });
    }
);
});