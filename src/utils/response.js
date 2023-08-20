class Response {
  OK = (body = null) =>
    this.generate(200, body);
  BadRequest = (msg = null) =>
    this.generate(400, msg ? { error: msg } : null);
  ServerError = (msg = null) =>
    this.generate(500, msg ? { error: msg } : null);

  generate(statusCode, body) {
    const headers = { "Content-Type": "application/json" };
    return { statusCode, body, headers };
  }
}
export default new Response();
