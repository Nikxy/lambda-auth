import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	UpdateCommand,
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
}

export default new Repository();
