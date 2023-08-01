import { handler } from '../index.mjs';

describe('lambda-login', () => {
    test('body should be valid JSON', async () => {
        const event = {
            body: "adsasd",
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
    });
    test('body should contain domain,username and password ', async () => {
        const event = {
            body: JSON.stringify({
                domain: "test",
            }),
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
    });
    test('body should contain domain,username and password ', async () => {
        const event = {
            body: JSON.stringify({
                domain: "test",
                password: "test",
            }),
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
    });
    test('invalid password', async () => {
        const event = {
            body: JSON.stringify({
                domain: "test",
                username: "test",
                password: "test",
            }),
        };
        const response = await handler(event);
        console.log(response);
        expect(response.statusCode).toBe(400);
    });
});