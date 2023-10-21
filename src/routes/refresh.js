import jwt from "#utils/jwt.js";
import response from "#utils/response.js";
import getSecret from "#utils/getSecret.js";
import repository from "#utils/authRepository.js";
import getParameterCaseInsensitive from "#utils/getParameterCaseInsensitive.js";

// REFRESH TOKEN
export default async function (event) {
	// Init data from request
	let tokenData;
	try {
		tokenData = initData(event.headers);
	} catch (e) {
		return response.Unauthorized(e.message);
	}

	// LOAD JWT SECRET
	let secrets;
	try {
		secrets = await getSecret(process.env.JWT_SECRET);
	} catch (error) {
		console.error("Can't get secret:", error);
		return response.ServerError();
	}

	// CHECK IF DOMAIN SECRET IS SET
	const jwtSecret = secrets[tokenData.domain];
	if (!jwtSecret) return response.Unauthorized("Invalid domain");

	// VERIFY JWT
    const jwtStatus = jwt.validateJWT(jwtSecret,tokenData.jwt);
    if(!jwtStatus.valid)
        return response.Unauthorized("Invalid token");

	// INIT REPOSITORY
	try {
		repository.init();
	} catch (error) {
		console.error("Can't init repository:", error.message);
		return response.ServerError();
	}

	// GET SESSION
	let session;
	try {
		session = await repository.getSession(tokenData.session);
	} catch (error) {
		console.error("Can't get session:", error.message);
		return response.ServerError();
	}

	// CHECK IF SESSION EXISTS
	if (session == null || session.doc_domain != tokenData.domain){
		return response.Unauthorized("Invalid session");
    }

	// CHECK IF REFRESH TOKEN IS VALID
	if (session.refresh_token != tokenData.refresh_token)
		return response.Unauthorized("Invalid refresh token");

	// CHECK IF SESSION IS EXPIRED
	if (session.expires < Date.now() / 1000)
		return response.Unauthorized("Session expired");

	// REFRESH SESSION
	let newRefreshToken;
	try {
		newRefreshToken = await repository.refreshSession(tokenData.session);
	} catch (error) {
		console.error("Can't refresh session:", error);
		return response.ServerError();
	}
	// CREATE NEW JWT TOKEN
	const newJWT = jwt.createJWTToken(
		jwtSecret,
		session.doc_domain,
		tokenData.username,
		session.id,
		newRefreshToken
	);

	// RESPOND OK WITH TOKEN
	return response.OK({ token: newJWT });
}

function initData(headers) {
	let jwtData = getParameterCaseInsensitive(headers, process.env.AUTH_HEADER);
	// CHECK IF AUTH HEADER IS PROVIDED
	if (!jwtData)
		throw new Error("Please provide a jwt authorization token");

	// CHECK IF TOKEN IS WITH BEARER PREFIX AND REMOVE IT
	const splitAuthHeader = jwtData.split(" ");
	if (splitAuthHeader.length == 2 && splitAuthHeader[0] == "Bearer")
		jwtData = splitAuthHeader[1];

	const jwtSplit = jwtData.split(".");
	try {
		return { ...JSON.parse(atob(jwtSplit[1])), jwt: jwtData };
	} catch (error) {
		throw new Error("Invalid token");
	}
}
