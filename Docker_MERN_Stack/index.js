// Loading required modules

const express = require("express");
const { exec } = require("child_process");
const http = require("http");
var path = require("path")
var bodyParser = require('body-parser');
const { stdout, stderr } = require("process");

// Initializing express app
const app = express()

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

serverIP = "localhost";

app.listen(80, () => {
    console.log("Server Started ......")
});
app.use("/homepage", express.static(path.join(__dirname, 'homepage')));
app.use("/homepage/images", express.static(path.join(__dirname, 'homepage/images')));
app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/homepage/index.html")
})
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/homepage/index.html")
})


app.use("/containers/main", express.static(path.join(__dirname, 'containers/main')));
app.use("/containers/create", express.static(path.join(__dirname, 'containers/create')));
app.use("/containers/list", express.static(path.join(__dirname, 'containers/list')));
app.use("/containers/start", express.static(path.join(__dirname, 'containers/start')));

app.get("/containers", (req, res) => {
    res.sendFile(__dirname + '/containers/main/index.html');
})

app.get("/containers/list/all", (req, response) => {
    console.log("Showing list of containers....");

    response.write(
        '<html><head><link rel="stylesheet" href="/containers/list/style.css"><script src="/containers/list/script.js"></script><title>Containers List</title></head>'
    );

    http.get('http://' + serverIP + ':2375/containers/json?all="true"', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);

            response.write('<body><div id="heading">List of All Containers</div><table><tr><th>Container ID</th><th>Container Name</th><th>Container Image</th><th>State</th><th>Status</th><th>Port</th><th>Command</th></tr>');
            if (parsedData.length == 0) {
                response.write("<tr><td colspan=7 >No containers available.</td></tr>");
            }
            else {
                for (let i = 0; i < parsedData.length; i++) {
                    let cId = parsedData[i].Id.slice(0, 12);
                    let cName = parsedData[i].Names[0].slice(1);
                    let cImage = parsedData[i].Image;
                    let cState = parsedData[i].State;
                    let cStatus = parsedData[i].Status;
                    let cCommand = parsedData[i].Command;
                    let cPort = parsedData[i].Ports;
                    let portString = "";
                    for (let j = 0; j < cPort.length; j++) {
                        portString = portString + cPort[j].IP + ":" + cPort[j].PublicPort + "->" + cPort[j].PrivatePort + "/" + cPort[j].Type + ",";
                    }

                    response.write("<tr><td>" + cId + "</td><td>" + cName + "</td><td>" + cImage + "</td><td>" + cState + "</td><td>" + cStatus + "</td><td>" + portString + "</td><td>" + cCommand + "</td></tr>");
                }
            }

            response.write("</table></body></html>");
            response.send();
        })
    });
})
app.get("/containers/list/running", (req, response) => {
    console.log("Showing list of containers....");

    response.write(
        '<html><head><link rel="stylesheet" href="/containers/list/style.css"><script src="/containers/list/script.js"></script><title>Containers List</title></head>'
    );

    http.get('http://' + serverIP + ':2375/containers/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);

            response.write('<body><div id="heading">List of Runnning Containers</div><table><tr><th>Container ID</th><th>Container Name</th><th>Container Image</th><th>State</th><th>Status</th><th>Port</th><th>Command</th></tr>');
            if (parsedData.length == 0) {
                response.write("<tr><td colspan=7 >No running containers available.</td></tr>");
            }
            else {
                for (let i = 0; i < parsedData.length; i++) {
                    let cId = parsedData[i].Id.slice(0, 12);
                    let cName = parsedData[i].Names[0].slice(1);
                    let cImage = parsedData[i].Image;
                    let cState = parsedData[i].State;
                    let cStatus = parsedData[i].Status;
                    let cCommand = parsedData[i].Command;
                    let cPort = parsedData[i].Ports;
                    let portString = "";
                    for (let j = 0; j < cPort.length; j++) {
                        portString = portString + cPort[j].IP + ":" + cPort[j].PublicPort + "->" + cPort[j].PrivatePort + "/" + cPort[j].Type + ",";
                    }

                    response.write("<tr><td>" + cId + "</td><td>" + cName + "</td><td>" + cImage + "</td><td>" + cState + "</td><td>" + cStatus + "</td><td>" + portString + "</td><td>" + cCommand + "</td></tr>");
                }
            }
            response.write("</table></body></html>");
            response.send();
        })
    });
})

app.get("/containers/create", (req, res) => {
    res.sendFile(__dirname + "/containers/create/index.html");
})

app.get("/containers/create/launch", (req, res) => {
    cname = req.query.cname;
    cimage = req.query.cimage;

    command = "docker run -dit -P --name " + cname + " " + cimage;
    exec(command, (err, stdout, stderr) => {
        res.write('<html><body bgcolor="darkgoldenrod">');
        res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
        res.write("<h1>!! Container Launching !! </h1><br /><br /><hr />");
        if (err) {
            res.write("<h3>" + stderr + "</h3>");
        } else {
            res.write("<h3> Container Name : " + cname + "</h3>");
            res.write("<h3> Container ID : " + stdout + "</h3><br /> <br />");
        }


        res.write('</div></body></html>');
        res.send();
    });
});

app.get("/containers/start", (req, res) => {
    res.sendFile(__dirname + "/containers/start/index.html");
})

app.get("/containers/start/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker start " + cname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write('<html><body bgcolor="darkgoldenrod">');
        res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
        res.write("<h1>!! Container Started !! </h1><br /><br /><hr />");
        res.write("<h3> Container ID/Name: " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/restart", express.static(path.join(__dirname, 'containers/restart')));
app.get("/containers/restart", (req, res) => {
    res.sendFile(__dirname + "/containers/restart/index.html");
})

app.get("/containers/restart/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker restart " + cname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write('<html><body bgcolor="darkgoldenrod">');
        res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
        res.write("<h1>!! Container Restarting !! </h1><br /><br /><hr />");
        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/stop", express.static(path.join(__dirname, 'containers/stop')));
app.get("/containers/stop", (req, res) => {
    res.sendFile(__dirname + "/containers/stop/index.html");
})

app.get("/containers/stop/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker stop " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Container Stopping !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/pause", express.static(path.join(__dirname, 'containers/pause')));
app.get("/containers/pause", (req, res) => {
    res.sendFile(__dirname + "/containers/pause/index.html");
})

app.get("/containers/pause/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker pause " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pausing Container !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});


app.use("/containers/unpause", express.static(path.join(__dirname, 'containers/unpause')));
app.get("/containers/unpause", (req, res) => {
    res.sendFile(__dirname + "/containers/unpause/index.html");
})

app.get("/containers/unpause/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker unpause " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Unpausing Container !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/stopAll", express.static(path.join(__dirname, 'containers/stopAll')));
app.get("/containers/stopAll", (req, res) => {
    res.sendFile(__dirname + "/containers/stopAll/index.html");
})

app.get("/containers/stopAll/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker stop $(docker ps -aq) | wc -l";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Stopping  All Containers!! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " containers stopped</h3><br /> <br />");
        }


        res.write('</div></body></html>');
        res.send();
    });
});


app.use("/containers/delete", express.static(path.join(__dirname, 'containers/delete')));
app.get("/containers/delete", (req, res) => {
    res.sendFile(__dirname + "/containers/delete/index.html");
})
app.get("/containers/delete/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker rm -f " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Deleting Container !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/deleteAll", express.static(path.join(__dirname, 'containers/deleteAll')));
app.get("/containers/deleteAll", (req, res) => {
    res.sendFile(__dirname + "/containers/deleteAll/index.html");
})

app.get("/containers/deleteAll/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker rm -f $(docker ps -aq) | wc -l";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Deleting All Containers!! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " containers deleted.</h3><br /> <br />");
        }


        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/inspect", express.static(path.join(__dirname, 'containers/inspect')));
app.use("/containers/inspect/result", express.static(path.join(__dirname, 'containers/inspect/result')));
app.get("/containers/inspect", (req, res) => {
    res.sendFile(__dirname + "/containers/inspect/index.html");
})

app.get("/containers/inspect/result", (req, response) => {
    cname = req.query.cname;

    http.get('http://' + serverIP + ':2375/containers/' + cname + '/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);
            parsedData = JSON.stringify(parsedData, null, 4);
            response.send('<html><head><link rel="stylesheet" href="/containers/inspect/result/style.css"></head><body><div id="infoPanel"> <h2>!! Container Information !! </h2><hr /> <pre>' + parsedData + '</pre></div></body></html>');
        });
    })

});

app.use("/containers/log", express.static(path.join(__dirname, 'containers/log')));
app.use("/containers/log/result", express.static(path.join(__dirname, 'containers/log/result')));
app.get("/containers/log", (req, res) => {
    res.sendFile(__dirname + "/containers/log/index.html");
})

app.get("/containers/log/result", (req, res) => {
    cname = req.query.cname;

    command = "docker logs " + cname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/containers/log/result/style.css"></head><body><div id="infoPanel"> <h2>!! Container "' + cname + '" Logs !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/containers/rename", express.static(path.join(__dirname, 'containers/rename')));
app.use("/containers/rename/result", express.static(path.join(__dirname, 'containers/rename/result')));

app.get("/containers/rename", (req, res) => {
    res.sendFile(__dirname + "/containers/rename/index.html");
})

app.get("/containers/rename/result", (req, res) => {
    oldname = req.query.oldname;
    newname = req.query.newname;

    command = "docker rename " + oldname + " " + newname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = "Rename Successful";
        }
        res.send('<html><head><link rel="stylesheet" href="/containers/log/result/style.css"></head><body><div id="infoPanel"> <h2>!! Renaming Container !! </h2><hr /> <br />' + output + '</div></body></html>');
    });
});


// Docker Hub Section

app.use("/hub/main", express.static(path.join(__dirname, 'hub/main')));
app.use("/hub/search", express.static(path.join(__dirname, 'hub/search')));
app.use("/hub/search/result", express.static(path.join(__dirname, 'hub/search/result')));

app.get("/hub", (req, res) => {
    res.sendFile(__dirname + "/hub/main/index.html");
})
app.get("/hub/search", (req, res) => {
    res.sendFile(__dirname + "/hub/search/index.html");
})
app.get("/hub/search/result", (req, res) => {
    searchTerm = req.query.searchTerm;

    command = "docker search " + searchTerm;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Search Result for : ' + searchTerm + ' !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/hub/login", express.static(path.join(__dirname, 'hub/login')));
app.get("/hub/login", (req, res) => {
    res.sendFile(__dirname + "/hub/login/index.html");
})
app.post("/hub/login/status", (req, res) => {
    username = req.body.username;
    password = req.body.password;

    command = "docker login -u " + username + " -p " + password;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = 'Error response from daemon: Get "https://registry-1.docker.io/v2/": unauthorized: incorrect username or password';
        } else {
            output = "Login Succeeded";
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Docker Login Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/hub/logout", express.static(path.join(__dirname, 'hub/logout')));
app.get("/hub/logout", (req, res) => {
    res.sendFile(__dirname + "/hub/logout/index.html");
})
app.get("/hub/logout/status", (req, res) => {
    command = "docker logout";
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Docker Logout Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/hub/push", express.static(path.join(__dirname, 'hub/push')));
app.get("/hub/push", (req, res) => {
    res.sendFile(__dirname + "/hub/push/index.html");
})
app.post("/hub/push/status", (req, res) => {
    fullImageName = req.body.imageName;
    command = "docker push " + fullImageName;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Pushing Docker Image to Docker Hub Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

// Docker Images Section
app.use("/images", express.static(path.join(__dirname, 'images')));
app.use("/images/list", express.static(path.join(__dirname, 'images/list')));
app.use("/images/main", express.static(path.join(__dirname, 'images/main')));

app.get("/images", (req, res) => {
    res.sendFile(__dirname + "/images/main/index.html");
})

function digits_count(n) {
    var count = 0;
    if (n >= 1) ++count;

    while (n / 10 >= 1) {
        n /= 10;
        ++count;
    }

    return count;
}

app.get("/images/list", (req, response) => {
    response.write(
        '<html><head><link rel="stylesheet" href="/images/list/style.css"><script src="/images/list/script.js"></script><title>Images List</title></head>'
    );

    http.get('http://' + serverIP + ':2375/images/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);

            response.write('<body><div id="heading">List of All Containers</div><table><tr><th>Repository</th><th>Tags</th><th>Image ID</th><th>Size</th></tr>');
            if (parsedData.length == 0) {
                response.write("<tr><td colspan=4 >No local images available.</td></tr>");
            }
            else {
                // for (let i = 0; i < parsedData.length; i++) {
                //     for (let j = 0; j < parsedData[i].RepoTags.length; j++) {
                //         let imageId = parsedData[i].Id.slice(8, 19);
                //         let currentRepoTag = parsedData[i].RepoTags[j];
                //         let splittedRepo = currentRepoTag.split(":");
                //         let repoName = splittedRepo[0];
                //         let repoTag = splittedRepo[1];

                //         let size = parsedData[i].Size;
                //         let digitCount = digits_count(size);

                //         if (digitCount <= 9) {
                //             newsize = (size * 1.0 / Math.pow(10, 6));
                //             newsize = newsize.toPrecision(3)
                //             newsize = newsize.split("e+")[0];
                //             newsize = newsize + "MB";
                //         }
                //         else {
                //             newsize = (size * 1.0 / Math.pow(10, 9));
                //             newsize = newsize.toPrecision(3)
                //             newsize = newsize.split("e+")[0];
                //             newsize = newsize + "GB";
                //         }

                //         response.write("<tr><td>" + repoName + "</td><td>" + repoTag + "</td><td>" + imageId + "</td><td>" + newsize + "</td></tr>");
                response.write(stringify(parsedData))
                    // }
                }
            // }

            // response.write("</table></body></html>");
            response.send();
        })
    });
})

app.use("/images/pull", express.static(path.join(__dirname, 'images/pull')));
app.get("/images/pull", (req, res) => {
    res.sendFile(__dirname + "/images/pull/index.html");
})
app.get("/images/pull/status", (req, res) => {
    image = req.query.imageName;
    command = "docker pull " + image;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Pulling Docker Image Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/images/delete", express.static(path.join(__dirname, 'images/delete')));
app.get("/images/delete", (req, res) => {
    res.sendFile(__dirname + "/images/delete/index.html");
})
app.get("/images/delete/status", (req, res) => {
    image = req.query.imageName;
    command = "docker rmi " + image;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Deleting Docker Image Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/images/history", express.static(path.join(__dirname, 'images/history')));
app.get("/images/history", (req, res) => {
    res.sendFile(__dirname + "/images/history/index.html");
})
app.get("/images/history/status", (req, res) => {
    image = req.query.imageName;
    command = "docker history " + image;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Container Image History  !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/images/inspect", express.static(path.join(__dirname, 'images/inspect')));
app.use("/images/inspect/result", express.static(path.join(__dirname, 'images/inspect/result')));
app.get("/images/inspect", (req, res) => {
    res.sendFile(__dirname + "/images/inspect/index.html");
})

app.get("/images/inspect/result", (req, response) => {
    image = req.query.imageName;

    http.get('http://' + serverIP + ':2375/images/' + image + '/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);
            parsedData = JSON.stringify(parsedData, null, 4);
            response.send('<html><head><link rel="stylesheet" href="/images/inspect/result/style.css"></head><body><div id="infoPanel"> <h2>!! Image Information !! </h2><hr /> <pre>' + parsedData + '</pre></div></body></html>');
        });
    })
});

app.use("/images/commit", express.static(path.join(__dirname, 'images/commit')));
app.get("/images/commit", (req, res) => {
    res.sendFile(__dirname + "/images/commit/index.html");
})

app.get("/images/commit/status", (req, res) => {
    cname = req.query.cname;
    image = req.query.imageName;

    command = "docker commit " + cname + " " + image;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        }
        else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Commit Image Status  !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    })
});



// Docker Prune Section
//Remove All Volumes
app.use("/prune/main", express.static(path.join(__dirname, 'prune/main')));
app.get("/prune", (req, res) => {
    res.sendFile(__dirname + "/prune/main/index.html");
})

app.use("/prune/allVolumes", express.static(path.join(__dirname, 'prune/allVolumes')));
app.get("/prune/allVolumes", (req, res) => {
    res.sendFile(__dirname + "/prune/allVolumes/index.html")
});
app.get("/prune/allVolumes/status", (req, res) => {

    command = "docker volume prune -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Volumes !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

//Clean The Resources Which Are Not Associated

app.use("/prune/sysResources", express.static(path.join(__dirname, 'prune/sysResources')));
app.get("/prune/sysResources", (req, res) => {
    res.sendFile(__dirname + "/prune/sysResources/index.html")
});

app.get("/prune/sysResources/status", (req, res) => {

    command = "docker system prune -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning System Resources !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

//  Remove Stopped And Unused Images 

app.use("/prune/stoppedImages", express.static(path.join(__dirname, 'prune/stoppedImages')));
app.get("/prune/stoppedImages", (req, res) => {
    res.sendFile(__dirname + "/prune/stoppedImages/index.html");
});

app.get("/prune/stoppedImages/status", (req, res) => {
    command = "docker system prune -a -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Stopped And Unused Images !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});



// Remove Dangling Docker Images

app.use("/prune/danglingImages", express.static(path.join(__dirname, 'prune/danglingImages')));
app.get("/prune/danglingImages", (req, res) => {
    res.sendFile(__dirname + "/prune/danglingImages/index.html")
});

app.get("/prune/danglingImages/status", (req, res) => {
    command = "docker image prune -a -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Dangling Docker Images !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});



// Remove All Unused Containers
app.use("/prune/unusedContainers", express.static(path.join(__dirname, 'prune/unusedContainers')));
app.get("/prune/unusedContainers", (req, res) => {
    res.sendFile(__dirname+"/prune/unusedContainers/index.html")
});

app.get("/prune/unusedContainers/status", (req, res) => {
    command = "docker container prune -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Unused Continers !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});


// Remove All Unused Docker Networks
app.use("/prune/unusedNetworks", express.static(path.join(__dirname, 'prune/unusedNetworks')));
app.get("/prune/unusedNetworks", (req, res) => {
    res.sendFile(__dirname+"/prune/unusedNetworks/index.html")
});
app.get("/prune/unusedNetworks", (req, res) => {

    command = "docker network prune -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Unused Docker Networks !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});


// Docker Networking
app.use("/Networking/main", express.static(path.join(__dirname, 'Networking/main')));
app.use("/Networking/create", express.static(path.join(__dirname, 'Networking/create')));
app.use("/Networking/create/result", express.static(path.join(__dirname, 'Networking/create/result')));




app.get("/Networking", (req, res) => {
    res.sendFile(__dirname + "/Networking/main/index.html");
})
app.get("/Networking/create", (req, res) => {
    res.sendFile(__dirname + "/Networking/create/index.html");
})

app.get("/Networking/create/result", (req, res) => {
    subnet = req.query.subnet;
    net_name = req.query.net_name;

    command = "docker network create --driver=bridge --subnet=" + subnet + " " + net_name;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/Networking/create/result/style.css"></head><body><div id="infoPanel"> <h2>"' + net_name + '" Network Created </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/Networking/list", express.static(path.join(__dirname, 'Networking/list')));
app.use("/Networking/list/result", express.static(path.join(__dirname, 'Networking/list/result')));


app.get("/Networking/list", (req, res) => {

    command = "docker network ls";
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.send('<html><head><link rel="stylesheet" href="/Networking/list/style.css"></head><body><div id="infoPanel"> <h2> Docker Networks List </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/Networking/inspect", express.static(path.join(__dirname, 'Networking/inspect')));
app.use("/Networking/inspect/result", express.static(path.join(__dirname, 'Networking/inspect/result')));


app.get("/Networking/inspect", (req, res) => {

    command = "docker network inspect bridge";
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.send('<html><head><link rel="stylesheet" href="/Networking/inspect/style.css"></head><body><div id="infoPanel"> <h2> Docker Inspect</h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

// Docker Volumes

app.use("/volumes/main", express.static(path.join(__dirname, 'volumes/main')));
app.use("/volumes/create", express.static(path.join(__dirname, 'volumes/create')));
app.use("/volumes/create/result", express.static(path.join(__dirname, 'volumes/create/result')));




app.get("/volumes", (req, res) => {
    res.sendFile(__dirname + "/volumes/main/index.html");
})
app.get("/volumes/create", (req, res) => {
    res.sendFile(__dirname + "/volumes/create/index.html");
})

app.get("/volumes/create/result", (req, res) => {
    v_name = req.query.v_name;

    command = "docker volume create " + v_name
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/volumes/create/result/style.css"></head><body><div id="infoPanel"> <h2>"' + v_name + '" Volume Created </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/volumes/inspect", express.static(path.join(__dirname, 'volumes/inspect')));
app.use("/volumes/inspect/result", express.static(path.join(__dirname, 'volumes/inspect/result')));

app.get("/volumes/inspect/result", (req, res) => {
    v_name = req.query.v_name;

    command = "docker volume inspect " + v_name
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/volumes/inspect/result/style.css"></head><body><div id="infoPanel"> <h2>"' + v_name + '" Volume info </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/volumes/remove", express.static(path.join(__dirname, 'volumes/remove')));
app.use("/volumes/remove/result", express.static(path.join(__dirname, 'volumes/remove/result')));

app.get("/volumes/remove/result", (req, res) => {
    v_name = req.query.v_name;

    command = "docker volume rm " + v_name
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/volumes/inspect/result/style.css"></head><body><div id="infoPanel"> <h2>"' + v_name + '" Volume deleted </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

// ################ Addition by Ddhruv ################

// ############## Codes for Services STARTS #############

// Code for Services Main files
app.use("/Services/main", express.static(path.join(__dirname, 'Services/main')));
app.get("/Services", (req, res) => {
    res.sendFile(__dirname + '/Services/main/index.html');
})

// Code for Start Option
app.use("/Services/start", express.static(path.join(__dirname, 'Services/start')));
app.get("/Services/start", (req, res) => {
    res.sendFile(__dirname + "/Services/start/index.html");
})

app.get("/Services/start/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl start docker";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Starting Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " Services Started Successfully</h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});


// Code for Enable Option
app.use("/Services/enable", express.static(path.join(__dirname, 'Services/enable')));
app.get("/Services/enable", (req, res) => {
    res.sendFile(__dirname + "/Services/start/index.html");
})

app.get("/Services/enable/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl enable docker";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Enabling Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " Services Enabled Successfully</h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for Restart Option
app.use("/Services/restart", express.static(path.join(__dirname, 'Services/restart')));
app.get("/Services/restart ", (req, res) => {
    res.sendFile(__dirname + "/Services/start/index.html");
})

app.get("/Services/restart/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl restart docker";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Restarting Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " Services Restarted Successfully</h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});


// Code for Stop Option
app.use("/Services/stop", express.static(path.join(__dirname, 'Services/stop')));
app.get("/Services/stop ", (req, res) => {
    res.sendFile(__dirname + "/Services/stop/index.html");
})

app.get("/Services/stop/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl stop docker";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Stoppinging Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " Services Stopped Successfully</h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});


// Code for Status Option
app.use("/Services/status", express.static(path.join(__dirname, 'Services/status')));
app.get("/Services/status ", (req, res) => {
    res.sendFile(__dirname + "/Services/status/index.html");
})

app.get("/Services/status/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl status docker -n 0";

    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto" >');
    res.write("<h1>!!Getting the Status of Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.write('<h3> Output :<pre style="font-size: 24px">' + output + "</pre> </h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});


// ############## Codes for Services ENDS #############

// ############## Codes for Logs STARTS #############

// Code for Logs Main files
app.use("/Logs/main", express.static(path.join(__dirname, 'Logs/main')));
app.get("/Logs", (req, res) => {
    res.sendFile(__dirname + '/Logs/main/index.html');
})

// Code for Version Option
app.use("/Logs/version/", express.static(path.join(__dirname, 'Logs/version/')));
app.get("/Logs/version/", (req, res) => {
    res.sendFile(__dirname + "/Logs/version/index.html");
})

app.get("/Logs/version/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo docker --version";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Docker Version Details !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : Current Version:  <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for Events Option
app.use("/Logs/events/", express.static(path.join(__dirname, 'Logs/events/')));
app.get("/Logs/events/", (req, res) => {
    res.sendFile(__dirname + "/Logs/events/index.html");
})

app.get("/Logs/events/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo docker events";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Docker Events !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : Events:  <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for Top Option
app.use("/Logs/top/", express.static(path.join(__dirname, 'Logs/top/')));
app.get("/Logs/top/", (req, res) => {
    res.sendFile(__dirname + "/Logs/top/index.html");
})

app.get("/Logs/top/launch", (req, res) => {
    cname = req.query.cname;
    command = "sudo docker top" + " " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Info. about" + " " + cname + " container !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output: " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output: <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for stats Option
app.use("/Logs/stats/", express.static(path.join(__dirname, 'Logs/stats/')));
app.get("/Logs/stats/", (req, res) => {
    res.sendFile(__dirname + "/Logs/stats/index.html");
})

app.get("/Logs/stats/launch", (req, res) => {
    cname = req.query.cname;
    command = "sudo docker stats" + " " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Stats. about" + " " + cname + " container !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output: " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output: <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for Port Option
app.use("/Logs/port/", express.static(path.join(__dirname, 'Logs/port/')));
app.get("/Logs/port/", (req, res) => {
    res.sendFile(__dirname + "/Logs/port/index.html");
})

app.get("/Logs/port/launch", (req, res) => {
    cname = req.query.cname;
    command = "sudo docker port" + " " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Info. about Port on " + " " + cname + " container !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output: " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output: <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
})
