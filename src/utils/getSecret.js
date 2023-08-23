import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

import initAWSConfig from "#utils/initConfig.js";

const clientSecrets = new SecretsManagerClient(initAWSConfig());

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