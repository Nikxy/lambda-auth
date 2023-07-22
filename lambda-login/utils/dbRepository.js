import getSecret from "./getSecret.js";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

class DBRepository {
  dynamo = null;
  table = process.env.DB_TABLE;

  constructor() {
    const client = new DynamoDBClient({});
    this.dynamo = DynamoDBDocumentClient.from(client);
  }

  async getUser(username, domain) {
    const res = await this.dynamo.send(
      await new GetCommand({
        TableName: this.table,
        Key: {
            type: "user",
          username,
          domain,
        },
      })
    );
    return res.Item;
  }
  async putUser(username, domain, password) {
    await this.dynamo.send(
      await new PutCommand({
        TableName: this.table,
        Item: {
          type: "user",
          username,
          domain,
          password
        },
      })
    );
  }
}

const dbRepository = new DBRepository();
export default dbRepository;
