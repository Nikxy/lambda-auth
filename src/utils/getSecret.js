import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

import checkLocal from "./checkLocal.js";

const config = { region: process.env.REGION };

checkLocal(config);

const clientSecrets = new SecretsManagerClient(config);

export default async function(secret_name) {
  let response;

  try {
    response = await clientSecrets.send(
      new GetSecretValueCommand({ SecretId: secret_name })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
  try {
    return JSON.parse(response.SecretString);
  } catch (e) {
    throw e;
  }
}