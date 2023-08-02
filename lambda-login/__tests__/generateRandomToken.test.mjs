import generateRandomToken from "../utils/generateRandomToken";

describe("util function generateRandomToken", () => {
    
  it("should return 32 characters as default", async () => {
    const token = generateRandomToken();
    expect(token.length).toBe(32);
  });

  it("should return specified length of characters ", async () => {
    const token = generateRandomToken(64);
    expect(token.length).toBe(64);
  });

  it("should return even when odd length specified", async () => {
    const token = generateRandomToken(15);
    expect(token.length).toBe(14);
  });
});
