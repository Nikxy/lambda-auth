/** Check if localend point provided and apply it */
export default function (config) {
    if (!process.env.LOCAL_ENDPOINT)
        return;
    config.endpoint = process.env.LOCAL_ENDPOINT;
    config.credentials = {
        accessKeyId: "mockMyKeyId",
        secretAccessKey: "mockSecretAccessKey"
    }
}