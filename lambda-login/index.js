import { DynamoDBClient  } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import response from "./utils/response.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import getSecret from "./utils/getSecret.js";
import checkLocal from "./utils/checkLocal.js";

// Check if all env variables are set
if (process.env.DB_TABLE == undefined) {
  console.error("env DB_TABLE not set");
  process.exit(1);
}
if (process.env.JWT_SECRET_KEY == undefined) {
  console.error("env JWT_SECRET_KEY not set");
  process.exit(1);
}

// Create Lambda Handler
const handler = async (event,context) => {
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
    jwtSecret = await getSecret(process.env.JWT_SECRET_KEY);
  } catch (e) {
    return response.ServerError(e.message);
  }
  // Check if domain secret is set
  if (!jwtSecret[data.domain])
    return response.BadRequest("Invalid Domain");

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
    return response.ServerError('db:'+e.message);
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
    return response.ServerError("Can't put refresh token: " + e.message);
  }

  const tokenData = {
    username: user.username,
    domain: data.domain,
    refresh_token: refreshToken,
  };
  const token = jwt.sign(tokenData, jwtSecret[data.domain], {
    expiresIn: "60s",
  });

  return response.OK({ token: token });
};
export { handler };

function initDB(){
  // Configure AWS DynamoDB
  const dbConfig = { region: "eu-central-1" };
  checkLocal(dbConfig);

  const client = new DynamoDBClient(dbConfig);
  return DynamoDBDocumentClient.from(client);
}

function initData(body){
  let data;
  try {
    data = JSON.parse(body);
  } catch (e) {
    throw new Error("Please provide a valid JSON body");
  }

  if (!data.username || !data.password || !data.domain)
    throw new Error("Username, password and domain are required");
  return data;
}