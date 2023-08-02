import {jest} from '@jest/globals'
import { handler } from '../index.mjs';
//jest.useFakeTimers();

describe('lambda-login', () => {
    beforeEach(() => {
        jest.useFakeTimers();
      });
    afterEach(() => {
        jest.runAllTimers();
    });
    it('body should be valid JSON', async () => {
        const event = {
            body: "adsasd",
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
    });
    it('body should contain domain,username and password ', async () => {
        const event = {
            body: JSON.stringify({
                domain: "test",
            }),
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
    });
    it('body should contain domain,username and password ', async () => {
        const event = {
            body: JSON.stringify({
                domain: "test",
                password: "test",
            }),
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
    });
    it('invalid password', async () => {
        const event = {
            body: JSON.stringify({
                domain: "test",
                username: "test",
                password: "test",
            }),
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(400);
    });
});