import Auth from "./auth";
import Loading from "./loading";

class Login {
	loginForm = document.getElementById("login-form");
	loginSubmitBtn = document.getElementById("login-form").elements["submit"];
	loginErrorElem = document.getElementById("login-error");

	loggedIn = null;

	init() {
		this.loginForm.onsubmit = this.submit;
	}

	showError = (message) => {
		this.loginErrorElem.innerText = message;
		this.loginErrorElem.style.display = "block";
	};
	hideError = () => {
		this.loginErrorElem.innerText = "";
		this.loginErrorElem.style.display = "none";
	};
	loading = (state) => {
		if (state) Loading.show();
		else Loading.hide();
		this.loginSubmitBtn.disabled = state;
	};

	submit = async (e) => {
		e.preventDefault();
		this.hideError();

		const domain = this.loginForm.elements["domain"].value;
		const username = this.loginForm.elements["username"].value;
		const password = this.loginForm.elements["password"].value;

		this.loading(true);
		let token = null;
		try {
			token = await Auth.Login(domain, username, password);
		}
		catch (error) {
			this.showError(error.message);
			return;
		}
		finally {
			this.loading(false);
		}

		this.loginForm.elements["password"].value = "";
		localStorage.setItem("jwt", token);

		if(this.loggedIn) this.loggedIn();
	};
}

export default new Login();
