function login() {
    window.location.replace("https://github.com/login/oauth/authorize?client_id=e3a6a83c52ebd43d0f14&state=gitviz");
}

function getToken() {
    var token = getParameterByName("token");
    if (token != null) {
        console.log(token);
        localStorage.token = token;
        window.location.replace("http://localhost:8000")
    }
}

function checkToken() {
    var token = localStorage.getItem("token");
    if (token == null) login();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
