class Auth {
    //BasePath = "https://sam.dev.callandorit.net/";
    BasePath = "https://auth.nikxy.dev/";

    Login = async (domain,username, password) => {
        const data = {
			domain,
			username,
			password,
		};

        let response;

		try {
			response = await fetch(this.BasePath + "login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
		} catch (error) {
            throw new Error("Login failed: " + error.message);
		}
		if (response.status != 200) {
			let errorMsg = response.statusText;
			const textRes = await response.text();
			if (textRes) {
				try {
					const errorJson = JSON.parse(textRes);
					errorMsg = errorJson.message;
				} catch (error) {
					console.error(error);
				}
			}
			throw new Error("Login failed: " + errorMsg);
		}
		let responseObj;
		try {
			responseObj = await response.json();
		} catch (error) {
			throw new Error("Login failed: invalid response");
		}
        return responseObj.token;
    }
	Refresh = async (jwt) => {
		let response;
		try {
			response = await fetch(this.BasePath + "refresh", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + jwt
				}
			});
		} catch (error) {
            throw new Error("Refresh failed: " + error.message);
		}
		if (response.status != 200) {
			let errorMsg = response.statusText;
			const textRes = await response.text();
			if (textRes) {
				try {
					const errorJson = JSON.parse(textRes);
					errorMsg = errorJson.message;
				} catch (error) {
					console.error(error);
				}
			}
			throw new Error("Refresh failed: " + errorMsg);
		}
		let responseObj;
		try {
			responseObj = await response.json();
		} catch (error) {
			throw new Error("Refresh failed: invalid response");
		}
        return responseObj.token;
	}
	Status = async (jwt) => {
		let response;
		try {
			response = await fetch(this.BasePath + "status", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + jwt
				}
			});
			return await response.json();
		} catch (error) {
            throw new Error("Status failed: " + error.message);
		}
	}
}

export default new Auth();