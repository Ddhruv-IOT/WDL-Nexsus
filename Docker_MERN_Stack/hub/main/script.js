serverIP = "localhost";

function searchImage() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/hub/search" , true);
    http.send();
}

function dockerLogin() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/hub/login" , true);
    http.send();
}

function dockerLogout() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/hub/logout" , true);
    http.send();
}

function pushImage() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/hub/push" , true);
    http.send();
}

