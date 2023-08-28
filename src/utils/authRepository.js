import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	UpdateCommand,
	ScanCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { v4 as uuidv4 } from "uuid";

import initAWSConfig from "#utils/initConfig.js";

class Repository {
	initialized = false;
	docClient = null;
	init = () => {
		if (this.initialized) return;
		const ddb = new DynamoDBClient(initAWSConfig());
		this.docClient = DynamoDBDocumentClient.from(ddb);
	};

	getSession = async (sessionId) => {
		const results = await this.docClient.send(
			new GetCommand({
				TableName: process.env.DB_TABLE,
				Key: {
					id: sessionId,
					doc_type: "session",
				},
			})
		);

		return results.Item;
	};
	refreshSession = async (sessionId) => {
		let refreshToken = uuidv4();
		await this.docClient.send(
			new UpdateCommand({
				TableName: process.env.DB_TABLE,
				Key: {
					id: sessionId,
					doc_type: "session",
				},
				UpdateExpression: "set refresh_token = :newRefreshToken",
				ExpressionAttributeValues: {
					":newRefreshToken": refreshToken,
				},
			})
		);
		return refreshToken;
	};

	findUser = async (domain, username) => {
		const results = await this.docClient.send(new ScanCommand({
			TableName: process.env.DB_TABLE,

			ExpressionAttributeValues: {
				":typeVal": "user",
				":name": username,
				":domainVal": domain,
			},
			FilterExpression:
				"doc_type = :typeVal and username = :name and doc_domain = :domainVal",
		}));

		if (results.Items.length < 1)
			return null

		return results.Items[0];
	};
	createSession = async (domain, userid,user_ip,user_agent) => {
		const sessionID = uuidv4();
		const refreshToken = uuidv4();
		const dateNow = Date.now()/1000;

		try {
			await this.docClient.send(new PutCommand({
				TableName: process.env.DB_TABLE,
				Item: {
					id: sessionID,
					doc_type: "session",
					doc_domain: domain,
					refresh_token: refreshToken,
					userid: userid,
					created: dateNow,
					expires: dateNow + 604800, // 7 days
					last_used: dateNow,
					user_ip: user_ip,
					user_agent: user_agent,
				},
			}));
		} catch (e) {
			console.error("DB: " + e.message);
			return response.ServerError();
		}


		return [sessionID, refreshToken];
	}
}

export default new Repository();
