import response from "./utils/response.js";
import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import getSecret from "./utils/getSecret.js";

// Check if all env variables are set
if (process.env.DB_TABLE == undefined) {
  console.error("env DB_TABLE not set");
  process.exit(1);
}
if (process.env.JWT_SECRET_KEY == undefined) {
  console.error("env JWT_SECRET_KEY not set");
  process.exit(1);
}

// Configure AWS DynamoDB
const dbConfig = { region: "eu-central-1" };
// Set endpoint if provided
if (process.env.DB_ENDPOINT) dbConfig.endpoint = process.env.DB_ENDPOINT;
const docClient = new AWS.DynamoDB.DocumentClient(dbConfig);

// Create Lambda Handler
export const handler = async (event) => {
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
    return response.ServerError(
      "Can't get jwt secret for domain: " + data.domain
    );

  // Get user from DynamoDB
  let results;
  try {
    const params = {
      TableName: process.env.DB_TABLE,

      ExpressionAttributeValues: {
        ":typeVal": "user",
        ":name": data.username,
        ":domainVal": data.domain,
      },
      FilterExpression:
        "doc_type = :typeVal and username = :name and doc_domain = :domainVal",
    };
    results = await docClient.scan(params).promise();
  } catch (e) {
    return response.ServerError(e.message);
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
  const params = {
    TableName: process.env.DB_TABLE,
    Item: {
      id: refreshToken,
      doc_type: "token",
      doc_domain: data.domain,
      created: dateNow,
      valid_until: dateNow + 604800, // 7 days
    },
  };
  try {
    await docClient.put(params).promise();
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

function initData(body) {
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
