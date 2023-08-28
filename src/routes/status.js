import response from "#utils/response.js";
import getSecret from "#utils/getSecret.js";
import jwt from "#utils/jwt.js";

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
	const jwtStatus = jwt.validateJWT(jwtSecret, tokenData.jwt);
	if (!jwtStatus.valid) return response.Unauthorized("Invalid token");

	const remainingSeconds = tokenData.exp - Math.floor(Date.now() / 1000);
	const remainingMinutes = Math.floor(remainingSeconds / 60);

	let remainingTime =
		remainingMinutes < 1 && remainingSeconds > -1
			? Math.abs(remainingSeconds) + " seconds"
			: Math.abs(remainingMinutes) + " minutes";
    let expired = remainingSeconds > 0 ? "Active for " : "Expired ";

	return response.OK({ ...jwtStatus, expiryString: expired+remainingTime });
}

function initData(headers) {
	// CHECK IF AUTH HEADER IS PROVIDED
	if (!headers["Authorization"])
		throw new Error("Please provide a jwt authorization token");

	// GET TOKEN FROM AUTH HEADER
	let jwtData = headers["Authorization"];

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
