import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import response from "#utils/response.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import getSecret from "#utils/getSecret.js";
import initDB from "#utils/initDB.js";

export default async function (event) {
    // Init data from request, check if valid
	let data;
	try {
		data = initData(event.body);
	} catch (e) {
		return response.BadRequest(e.message);
	}

	// Init JWT secret
	let jwtSecret;
	try {
		jwtSecret = await getSecret(process.env.JWT_SECRET);
	} catch (e) {
		var message = e.message;

		if (e.$response != undefined)
			console.error(message + ": " + e.$response.reason);
		else console.error(message);
		return response.ServerError();
	}
	// Check if domain secret is set
	if (!jwtSecret[data.domain]) return response.BadRequest("Invalid Domain");

	const docClient = initDB();
	// Get user from DynamoDB
	let results;
	try {
		const command = new ScanCommand({
			TableName: process.env.DB_TABLE,

			ExpressionAttributeValues: {
				":typeVal": "user",
				":name": data.username,
				":domainVal": data.domain,
			},
			FilterExpression:
				"doc_type = :typeVal and username = :name and doc_domain = :domainVal",
		});

		results = await docClient.send(command);
	} catch (e) {
		console.error("DB: " + e.message);
		return response.ServerError();
	}
	// Check if user exists
	if (results.Items.length < 1)
		return response.BadRequest("Invalid username or password");

	const user = results.Items[0];
	// Check if password is correct
	if (!bcrypt.compareSync(data.password, user.password))
		return response.BadRequest("Invalid username or password");

	// Generate refresh token
	const refreshToken = uuidv4();
	const dateNow = Date.now();
	const command = new PutCommand({
		TableName: process.env.DB_TABLE,
		Item: {
			id: refreshToken,
			doc_type: "token",
			doc_domain: data.domain,
			created: dateNow,
			valid_until: dateNow + 604800, // 7 days
		},
	});
	try {
		await docClient.send(command);
	} catch (e) {
		console.error("DB: " + e.message);
		return response.ServerError();
	}

	const tokenData = {
		username: user.username,
		domain: data.domain,
		refresh_token: refreshToken,
	};
	const token = jwt.sign(tokenData, jwtSecret[data.domain], {
		expiresIn: "5m",
	});

	return response.OK({ token: token });
}

function initData(body) {
	let data;
	try {
		data = JSON.parse(body);
	} catch (e) {
		throw new Error("Please provide a valid JSON body");
	}
	if(data == null)
		throw new Error("Please provide a valid JSON body");

	if (!data.username || !data.password || !data.domain)
		throw new Error("Please provide domain,username & password");
	return data;
}