/** Check if localend point provided and apply it */
export default function () {
	const config = { region: process.env.REGION };

    // Check if local endpoint provided and apply it
	if (process.env.LOCAL_ENDPOINT) {
		console.log('Local endpoint provided, using it instead of AWS')
		config.endpoint = process.env.LOCAL_ENDPOINT;
		config.credentials = {
			accessKeyId: "mockMyKeyId",
			secretAccessKey: "mockSecretAccessKey",
		};
	}
	return config;
}
