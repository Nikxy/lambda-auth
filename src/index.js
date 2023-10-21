import response from "#utils/response.js";

import routeLogin from './routes/login.js';
import routeStatus from './routes/status.js';
import routeRefresh from './routes/refresh.js';

import authorizer from './authorizer.js';

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
if (process.env.AUTH_HEADER == undefined) {	
	console.error("env AUTH_HEADER not set");
	process.exit(1);
}

// Create Lambda Handler
const handler = async (event) => {
	if(event.type && event.type == "TOKEN"){
		return await authorizer(event);
	}
	if(event.httpMethod == "OPTIONS")
		return response.OK();
	switch (event.resource){
		case "/login":			
			return await routeLogin(event);
		case "/status":
			return await routeStatus(event);
		case "/refresh":
			return await routeRefresh(event);
		case "/auth":
			return response.OK("Hello Auth World!");
		default:
			return response.BadRequest("Invalid Request");
	}
};
export { handler };