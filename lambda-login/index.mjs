import response from "./utils/response.js";
/*
import bcrypt from "bcryptjs";
import createJwtToken from "./utils/createJwtToken.js";
import getSecret from "./utils/getSecret.js";
import dbRepository from "./utils/dbRepository.js";
*/

export const handler = async (event) => {

  return response.generateOK();
    // Init data from request, check if valid
  /*let data;
  try {
    data = initData(event.body);
  } catch (e) {
    return responseBadRequest(e.message);
  }

  if(data.create == "yeah") {
    try {
      const hashedPassword = bcrypt.hashSync(data.password, 10);
      await dbRepository.putUser(data.username, data.domain, hashedPassword);
    } catch (e) {
      console.error("Can't create user: " + e);
      return responseServerError("Server error");
    }
    return responseEmptyOK();
  }*/
/*
    // Get user from db
  const resUser = await postpresql.query(
    "SELECT * FROM users WHERE username = $1 AND domain = $2",
    [data.username, data.domain]
  );
// Check if user exists
  if (resUser.rows.length === 0)
    return responseBadRequest("Invalid username or password");

  const user = resUser.rows[0];

  if (!bcrypt.compareSync(data.password, user.password))
    return responseBadRequest("Invalid username or password");

  const jwtSecret = await getSecret(process.env.JWT_SECRET_KEY);
  if (!jwtSecret[data.domain]) {
    console.error("Can't get jwt secret for domain: " + data.domain);
    return responseBadRequest("Server error");
  }

  const tokens = await postpresql.query(
    "SELECT uuid_generate_v4() as main,uuid_generate_v4() as refresh"
  );

  const refreshToken = tokens.rows[0].refresh;
  const mainToken = tokens.rows[0].main;
  await postpresql.query(
    "INSERT INTO tokens (id,refresh_token,user_id) VALUES ($1, $2, $3)",
    [mainToken, refreshToken, user.id]
  );

  const token = createJwtToken(
    data.domain,
    user,
    refreshToken,
    jwtSecret[data.domain]
  );
  const jsonData = JSON.stringify({ token: token });
  return { statusCode, jsonData, headers };
  */
  return responseBadRequest("Not implemented yet");
};

function initData(body) {
  let data;
  try {
    data = JSON.parse(body);
  } catch (e) {
    throw new Error("Please provide valid JSON body");
  }

  if (!data.username || !data.password || !data.domain)
    throw new Error("Username, password and domain are required");
  return data;
}