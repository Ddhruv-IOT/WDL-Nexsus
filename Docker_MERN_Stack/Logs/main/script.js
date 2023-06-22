serverIP = "containertool.ddns.net";

function getDockerVersion() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Logs/version/", true)
    http.send();
}

function getDockerEvents() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Logs/events/", true)
    http.send();
}

function topDocker() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Logs/top/", true)
    http.send();
}

function getDockerStats() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Logs/stats/", true)
    http.send();
}

function getDockerPort() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Logs/port/", true)
    http.send();
}