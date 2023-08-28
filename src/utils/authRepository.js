import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

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
	updateSession = async (sessionId, refreshToken) => {
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
	};
}

export default new Repository();
