import generateRandomToken from "../utils/generateRandomToken";

test("test generateRandomToken", async () => {

    const token = generateRandomToken();
    expect(token.length).toBe(32);
    }
);
test("test generateRandomToken length", async () => {
    const token = generateRandomToken(64);
    expect(token.length).toBe(64);
    }
);
test("test generateRandomToken odd length", async () => {
    const token = generateRandomToken(15);
    expect(token.length).toBe(14);
    }
);