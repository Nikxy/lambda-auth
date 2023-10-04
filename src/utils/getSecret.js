import {
	SecretsManagerClient,
	GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

import initAWSConfig from "#utils/initConfig.js";

const clientSecrets = new SecretsManagerClient(initAWSConfig());

let secretString = null;
export default async function (secret_name) {
	let response;

	//if (secretString == null) {
		console.time("secretsmanager");
		try {
			response = await clientSecrets.send(
				new GetSecretValueCommand({ SecretId: secret_name })
			);
		} catch (error) {
			// For a list of exceptions thrown, see
			// https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
			throw error;
		}
		console.timeEnd("secretsmanager");
		secretString = response.SecretString;
	/*} else {
		console.log("Using cached secret");
	}*/
	try {
		return JSON.parse(secretString);
	} catch (e) {
		throw e;
	}
}
