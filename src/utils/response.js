class Response {
	OK = (body = null) =>
		this.Generate(200, body);
	BadRequest = (msg = null) =>
		this.Generate(400, msg ? { message: msg } : null);
	ServerError = (msg = null) =>
		this.Generate(500, msg ? { message: msg } : null);

	Generate(statusCode, body) {
		const headers = {
			"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
			"Access-Control-Allow-Methods": "POST,OPTIONS",
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		};
		return {
			statusCode,
			body: body == null ? null : JSON.stringify(body),
			headers,
		};
	}
}
export default new Response();
