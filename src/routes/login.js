import response from "#utils/response.js";
import getSecret from "#utils/getSecret.js";
import repository from "#utils/authRepository.js";
import jwt from "#utils/jwt.js";

import bcrypt from "bcryptjs";

export default async function (event) {
	// Init data from request, check if valid
	let data;
	try {
		data = initData(event.body);
	} catch (e) {
		return response.BadRequest(e.message);
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
	const jwtSecret = secrets[data.domain];
	if (!jwtSecret) return response.BadRequest("Invalid domain");

	// INIT REPOSITORY
	try {
		repository.init();
	} catch (error) {
		console.error("Can't init repository:", error.message);
		return response.ServerError();
	}
	let user;
	try {
		user = await repository.findUser(data.domain, data.username);
	} catch (e) {
		console.error("DB: " + e.message);
		return response.ServerError();
	}
	// Check if domain + username or password is correct
	if (user == null || !bcrypt.compareSync(data.password, user.password))
		return response.BadRequest("Invalid username or password");

	// Generate refresh token
	let sessionID, refreshToken;

	const user_ip = event["requestContext"]["identity"]["sourceIp"];
	const user_agent = event["requestContext"]["identity"]["userAgent"];
	try {
		[sessionID, refreshToken] = await repository.createSession(
			data.domain,
			user.id,
			user_ip,
			user_agent
		);
	} catch (e) {
		console.error("DBs: " + e.message);
		return response.ServerError();
	}

	const newJWT = jwt.createJWTToken(
		jwtSecret,
		data.domain,
		user.username,
		sessionID,
		refreshToken
	);

	return response.OK({ token: newJWT });
}

function initData(body) {
	let data;
	try {
		data = JSON.parse(body);
	} catch (e) {
		throw new Error("Please provide a valid JSON body");
	}
	if (data == null) throw new Error("Please provide a valid JSON body");

	if (!data.username || !data.password || !data.domain)
		throw new Error("Please provide domain,username & password");
	return data;
}
