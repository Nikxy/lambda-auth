export default function (jwtData) {
    // CHECK IF TOKEN IS WITH BEARER PREFIX AND REMOVE IT
    const splitAuthHeader = jwtData.split(" ");
    if (splitAuthHeader.length == 2 && splitAuthHeader[0] == "Bearer")
        jwtData = splitAuthHeader[1];
    else throw new Error("Invalid token");

    const jwtSplit = jwtData.split(".");
    if(jwtSplit.length != 3) throw new Error("Invalid token");
    try {
        return { ...JSON.parse(atob(jwtSplit[1])), jwt: jwtData };
    } catch (error) {
        throw new Error("Invalid token");
    }
}