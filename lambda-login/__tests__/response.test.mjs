import response from "../utils/response";

const testData = {
  test: "test",
};
const errorData = {
  error: "test",
};

describe("util class response", async () => {
  describe("generate", async () => {
    it("should respond with specified status & data", async () => {
      const res = response.generate(200, testData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(testData);
    });
  });
  describe("OK", async () => {
    it("should respond ok without data", async () => {
      const res = response.OK();
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeNull();
    });
    it("should respond ok with data", async () => {
      const res = response.OK(testData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(testData);
    });
  });
  describe("BadRequest", async () => {
    it("should respond 400 without data", async () => {
      const res = response.BadRequest();
      expect(res.statusCode).toBe(400);
      expect(res.body).toBeNull();
    });
    it("should respond 400 with data", async () => {
      const res = response.BadRequest(errorData.error);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual(errorData);
    });
  });
  describe("ServerError", async () => {
    it("should respond 500 without data", async () => {
        const res = response.ServerError();
        expect(res.statusCode).toBe(500);
        expect(res.body).toBeNull();
      });
    it("should respond 500 with data", async () => {
      const res = response.ServerError("test");
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: "test" });
    });
  });
});
