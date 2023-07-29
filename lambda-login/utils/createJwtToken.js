import jwt from "jsonwebtoken";

export default function ({domain,user,refreshToken,jwtSecret}){
    const tokenData = {
        domain: domain,
        userid: user.id,
        username: user.username,
        refreshToken: refreshToken
    };
    // Return token
    return jwt.sign(tokenData,jwtSecret,
        { expiresIn: '60s' });;
}