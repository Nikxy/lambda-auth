import { checkLocal } from "checkLocal.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

function initDB() {
	// Configure AWS DynamoDB
	const dbConfig = { region: process.env.REGION };
	checkLocal(dbConfig);

	const client = new DynamoDBClient(dbConfig);
	return DynamoDBDocumentClient.from(client);
}
export default initDB;