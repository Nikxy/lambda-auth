import jsonwebtoken from 'jsonwebtoken';
import createJwtToken from '../utils/createJwtToken';
import generateRandomToken from '../utils/generateRandomToken';

const testsecret = "asdasd";
const validData = {
    domain: 'example.com',
    user: {
        id: '1234567890',
        username: 'testuser'
    },
    refreshToken: generateRandomToken(),
    jwtSecret: testsecret
}

describe('util function createJwtToken', () => {
    it('should return a valid JWT', () => {
        const token = createJwtToken(validData);
        expect(token).toEqual(expect.any(String));
        expect(token.split('.').length).toEqual(3);
        expect(() => jsonwebtoken.verify(token, testsecret)).not.toThrow();
    });
    it('should return a JWT with the correct data', () => {
        const token = createJwtToken(validData);
        const decoded = jsonwebtoken.decode(token);
        expect(decoded).toEqual(expect.objectContaining({
            domain: validData.domain,
            userid: validData.user.id,
            username: validData.user.username,
            refreshToken: validData.refreshToken
        }));
    });
});
