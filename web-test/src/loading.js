class Loading {
    loadingOverlay = document.getElementById("loading");
    show() {
        this.loadingOverlay.style.display = "flex";
    }
    hide() {
        this.loadingOverlay.style.display = "none";
    }
}
export default new Loading();