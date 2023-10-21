import loadAuthToken from "#utils/loadAuthToken.js";
import getSecret from "#utils/getSecret.js";
import jwt from "#utils/jwt.js";
import response from "#utils/response.js";

export default async function (event) {
	const jwtData = event.authorizationToken;
	// Init data from request
	let tokenData;
	try {
		tokenData = loadAuthToken(jwtData);
	} catch (e) {
		return authorizerResponse.Unauthorized(event);
	}

	// LOAD JWT SECRET
	let secrets;
	try {
		secrets = await getSecret(process.env.JWT_SECRET);
	} catch (error) {
		console.error("Can't get secret:", error);
		return response.ServerError();
	}

	// Check if domain JWT secret exists
	const jwtSecret = secrets[tokenData.domain];

	if (!jwtSecret) return authorizerResponse.Unauthorized(event);
	// Verify JWT
	const jwtStatus = jwt.validateJWT(jwtSecret, tokenData.jwt);
	if (!jwtStatus.valid || jwtStatus.expired)
		return authorizerResponse.Unauthorized(event);

	return authorizerResponse.Allow(event);
}

const authorizerResponse = {
	Unauthorized: (event) => generatePolicy("user", "Deny", event.methodArn),
	Allow: (event) => generatePolicy("user", "Allow", event.methodArn),
};

const generatePolicy = (principalId, effect, resource) => {
	return {
		principalId: principalId,
		policyDocument: {
			Version: "2012-10-17",
			Statement: [
				{
					Action: "execute-api:Invoke",
					Effect: effect,
					Resource: resource,
				},
			],
		},
	};
};
