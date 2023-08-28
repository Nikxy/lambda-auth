import jwt from "jsonwebtoken";

export default {
    createJWTToken: (jwtSecret, domain, username, session, refresh_token) => {
        console.log("createJWTToken ",jwtSecret, domain, username, session, refresh_token)
		return jwt.sign(
			{
				domain,
				username,
				session,
				refresh_token,
			},
			jwtSecret,
			{ expiresIn: "5m" }
		);
	},
	validateJWT: (jwtSecret, token) => {
		const response = {
			valid: false,
			expired: false,
		};
		try {
			jwt.verify(token, jwtSecret);
			response.valid = true;
		} catch (error) {
			if (error.name == "TokenExpiredError") {
				response.valid = true;
				response.expired = true;
			}
		}

		return response;
	}
}