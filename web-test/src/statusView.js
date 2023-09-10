import Loading from "./loading";
import getTimestamp from "./getTimestamp.js";
import { errors } from "jose";
import Auth from "./auth";

class Status {
	loggedOut = null;
	/**
	 * Init Status view
	 * Call before using any other function
	 */
	init = () => {
		const thas = this;
		document.getElementById("status-refresh-token").onclick =
			this.refreshToken;
		document.getElementById("status-get").onclick =
			this.checkStatus;
		document.getElementById("status-logout").onclick = async function (e) {
			thas.logout();
		};
	};

	getTokenData = () => {
		try {
			return JSON.parse(atob(localStorage.getItem("jwt").split(".")[1]));
		} catch (error) {
			throw new Error("Can't parse token data");
		}
	};

	logout = () => {
		localStorage.removeItem("jwt");
		if (this.loggedOut) this.loggedOut();
	};

	update = () => {
		let tokenData;
		try {
			tokenData = this.getTokenData();
		} catch (error) {
			console.error(error);
			this.logout();
			return;
		}
		document.getElementById("status-domain").innerText = tokenData.domain;
		document.getElementById("status-username").innerText =
			tokenData.username;
		const issueDate = new Date(tokenData.iat * 1000);
		document.getElementById("status-issued").innerText =
			issueDate.toLocaleString();

		const expDate = new Date(tokenData.exp * 1000);
		document.getElementById("status-expiry").innerText =
			expDate.toLocaleString();
		const expiredElem = document.getElementById("status-expired");
		if (getTimestamp() > tokenData.exp) {
			expiredElem.style.color = "red";
			expiredElem.innerText = "Expired";
			document.getElementById("status-refresh-token").disabled = false;
		} else {
			const remainingSeconds = tokenData.exp - getTimestamp();
			const remainingMinutes = Math.floor(remainingSeconds / 60);
			let remainingTime = remainingMinutes + " minutes";
			if(remainingMinutes < 1){
				remainingTime = remainingSeconds + " seconds";
			}
			expiredElem.style.color = "green";
			expiredElem.innerText =
				"Active for " + remainingTime;
		}
	};
	refreshToken = async (e) => {
		Loading.show();
		let newJWT;
		try {
			newJWT = await Auth.Refresh(localStorage.getItem("jwt"));
		}
		catch (error) {
			console.error(error);
			return;
		}
		finally {
			Loading.hide();
		}
		localStorage.setItem("jwt",newJWT);
		this.update();
	};

	
	checkStatus = async () => {
		Loading.show();
		let status;
		try {
			status = await Auth.Status(localStorage.getItem("jwt"));
		}
		catch (error) {
			console.error(error);
			return;
		}
		finally {
			Loading.hide();
		}
		console.log(status);
	}
}
export default new Status();
