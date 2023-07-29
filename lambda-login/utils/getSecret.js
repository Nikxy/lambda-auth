import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const clientSecrets = new SecretsManagerClient({
  region: "eu-central-1",
});

async function getSecret(secret_name) {
  let response;

  try {
    console.log("Getting secret" + secret_name);
    response = await clientSecrets.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
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

export default getSecret;