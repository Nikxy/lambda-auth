class Response {
  generateOK = (body = null) =>
    this.generate(200, body == null ? null : body);
  generateBadRequest = (msg = null) =>
    this.generate(400, msg ? { error: msg } : null);
  generateServerError = (msg = null) =>
    this.generate(500, msg ? { error: msg } : null);

  generate(statusCode, body) {
    const headers = { "Content-Type": "application/json" };
    return { statusCode, body, headers };
  }
}
export default new Response();
