import response from "../utils/response";

const testData = {
  test: "test",
};
const errorData = {
  error: "test",
};

describe("util class response", () => {
  describe("generate", () => {
    it("should respond with specified status & data", async () => {
      const res = response.generate(200, testData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(testData);
    });
  });
  describe("generateOK", () => {
    it("should respond ok without data", async () => {
      const res = response.generateOK();
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeNull();
    });
    it("should respond ok with data", async () => {
      const res = response.generateOK(testData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(testData);
    });
  });
  describe("generateBadRequest", () => {
    it("should respond 400 without data", async () => {
      const res = response.generateBadRequest();
      expect(res.statusCode).toBe(400);
      expect(res.body).toBeNull();
    });
    it("should respond 400 with data", async () => {
      const res = response.generateBadRequest(errorData.error);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual(errorData);
    });
  });
  describe("generateServerError", () => {
    it("should respond 500 without data", async () => {
        const res = response.generateServerError();
        expect(res.statusCode).toBe(500);
        expect(res.body).toBeNull();
      });
    it("should respond 500 with data", async () => {
      const res = response.generateServerError("test");
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: "test" });
    });
  });
});
