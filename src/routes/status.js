import response from "#utils/response.js";
import jwt from "jsonwebtoken";
import getSecret from "#utils/getSecret.js";

export default async function (event) {
    if(event.headers["Authorization"] == undefined)
        return response.BadRequest("No authorization token provided");
    // Check if token is valid & not expired
    const token = event.headers["Authorization"];
    const jwttoken = jwt.decode(token);
    if(jwttoken == null)
        return returnInvalidToken();
    
    const secret = await getSecret(process.env.JWT_SECRET);

    if(secret[jwttoken.domain] == undefined)
        return returnInvalidToken();

    try {
        jwt.verify(token, secret[jwttoken.domain]);
    } catch (e) {
        if(e.name == "TokenExpiredError")
            return response.Generate(401,"Token Expired");
        else
            return returnInvalidToken();
    }

    return response.OK({status: "OK"});
}

function returnInvalidToken(num = ""){
    return response.Generate(401,"Invalid token."+num);
}