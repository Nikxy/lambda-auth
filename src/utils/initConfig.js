/** Check if localend point provided and apply it */
export default function () {
	const config = { region: process.env.REGION };

    // Check if local endpoint provided and apply it
	if (process.env.LOCAL_ENDPOINT) {
		config.endpoint = process.env.LOCAL_ENDPOINT;
		config.credentials = {
			accessKeyId: "mockMyKeyId",
			secretAccessKey: "mockSecretAccessKey",
		};
	}
	return config;
}
