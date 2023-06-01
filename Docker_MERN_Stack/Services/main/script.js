serverIP = "localhost";

function startDockerServices() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Services/start/", true)
    http.send();
}

function enableDockerServices() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Services/enable/", true)
    http.send();
}

function restartDockerServices() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Services/restart/", true)
    http.send();
}

function stopDockerServices() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Services/stop/", true)
    http.send();
}

function statusDockerServices() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Services/status/", true)
    http.send();
}