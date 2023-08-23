class Response {
	OK = (body = null) =>
		this.generate(200, body);
	BadRequest = (msg = null) =>
		this.generate(400, msg ? { message: msg } : null);
	ServerError = (msg = null) =>
		this.generate(500, msg ? { message: msg } : null);

	generate(statusCode, body) {
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
