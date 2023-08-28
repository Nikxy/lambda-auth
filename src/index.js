import response from "#utils/response.js";

import routeLogin from './routes/login.js';
import routeStatus from './routes/status.js';

// Check if all env variables are set
if (process.env.DB_TABLE == undefined) {
	console.error("env DB_TABLE not set");
	process.exit(1);
}
if (process.env.JWT_SECRET == undefined) {
	console.error("env JWT_SECRET not set");
	process.exit(1);
}
if (process.env.REGION == undefined) {
	console.error("env REGION not set");
	process.exit(1);
}

// Create Lambda Handler
const handler = async (event, context) => {
	if(event.httpMethod == "OPTIONS")
		return response.OK();
	switch (event.resource){
		case "/login":
			return await routeLogin(event);
		case "/status":
			return await routeStatus(event);
		default:
			return response.BadRequest("Invalid Request");
	}
};
export { handler };