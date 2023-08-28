import './style.css'

import login from "./src/loginView.js";
import status from "./src/statusView.js";
import loading from "./src/loading.js";

login.init();
login.loggedIn = updateAppPage;

status.init();
status.loggedOut = updateAppPage;

const pages = [
    "login",
    "status"
];
function hideAllPages(){
    pages.forEach(page => {
        document.getElementById(page).style.display = "none";
    });
}
let statusInterval = null;
function updateAppPage() {
    if(statusInterval != null){
        clearTimeout(statusInterval);
        statusInterval = null;
    }
    hideAllPages();
    if(!localStorage.getItem("jwt")){
        document.getElementById("login").style.display = "block";
    } else {
        document.getElementById("status").style.display = "block";
        status.update();
        statusInterval = setInterval(status.update, 1000);
    }
    loading.hide();
}

updateAppPage();