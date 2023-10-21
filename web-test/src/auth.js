class Auth {
    ServiceURL = null;

    Login = async (domain,username, password) => {
		this.CheckURLSet();
        const data = {
			domain,
			username,
			password,
		};

        let response;

		try {
			response = await fetch(new URL("login",this.ServiceURL), {
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
		this.CheckURLSet();
		let response;
		try {
			response = await fetch(new URL("refresh",this.ServiceURL), {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorizationjwt": "Bearer " + jwt
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
		this.CheckURLSet();
		let response;
		try {
			response = await fetch(new URL("status",this.ServiceURL), {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorizationjwt": "Bearer " + jwt
				}
			});
			return await response.json();
		} catch (error) {
            throw new Error("Status failed: " + error.message);
		}
	}
	CheckURLSet = () => {
		if(!this.ServiceURL) throw new Error("ServiceURL not set");
	}
}

export default new Auth();