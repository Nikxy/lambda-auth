class Response {
  generateEmptyOK = () => this.generate(200, null);
  generateOK = (body) => this.generate(200, JSON.stringify(body));
  generateBadRequest = (msg) => this.generate(400, msg ? { error: msg } : null);
  generateServerError = (msg) =>
    this.generate(500, msg ? { error: msg } : null);

  generate(statusCode, body) {
    const headers = { "Content-Type": "application/json" };
    return { statusCode, body, headers };
  }
}
export default new Response();
