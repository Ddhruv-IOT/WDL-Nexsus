serverIP = "localhost"
function createContainer() {
    let cname = document.getElementById("cname").value;
    let cimage = document.getElementById("cimage").value;

    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://"+ serverIP +"/containers/create/status?cname=" + cname + "&cimage=" + cimage, true);
    http.send();
}
