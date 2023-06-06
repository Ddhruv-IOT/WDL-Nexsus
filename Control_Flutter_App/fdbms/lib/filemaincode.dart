import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_tts/flutter_tts.dart';

String command;
String a = " ";
var stat = false;
var ipin = " ";
var collectiond = "default";
List<Widget> y = [];

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  var authc = FirebaseAuth.instance;
  FlutterTts flutterTts = FlutterTts();
  var ip = '192.168.1.205';
  List<String> y = [];

  getmsg() async {
    await for (var ry
        in fsconnect.collection("$collectiond").orderBy("time").snapshots()) {
      for (var er in ry.docs) {
        print(er.data());
      }
    }
  }

  speak() async {
    var tts = "Welcome to the FIRE CMD";
    await flutterTts.setPitch(0.9);
    await flutterTts.setVolume(1);
    await flutterTts.setLanguage("en-IN");
    await flutterTts.speak(tts);
  }

  xaav() {
    setState(() {
      stat = true;
    });
  }

  run(command) async {
    var data = " ";
    var url = "http://$ipin/cgi-bin/doccmd.py?z=$command";
    var r = await http.get(url);
    data = r.body;
    print(data);
    a = data;
    setState(() {
      a = data;
      stat = false;
    });

    setState(() {
      fsconnect.collection("$collectiond").add({
        'Input -> $command': 'output -> $a',
      });
    });
  }

  var fsconnect = FirebaseFirestore.instance;

  @override
  void initState() {
    super.initState();
    var user;
    setState(() {
      user = authc.currentUser;
      collectiond = user.email;
    });
    speak();
    getmsg();
  }

  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        resizeToAvoidBottomPadding: false,
        appBar: AppBar(
          title: Text(
            'FIRE CMD',
            style: TextStyle(color: Colors.lime),
          ),
          backgroundColor: Colors.black,
          actions: <Widget>[
            IconTheme(
              data: IconThemeData(color: Colors.lime),
              child: IconButton(
                icon: Icon(Icons.arrow_back),
                onPressed: () async {
                  await authc.signOut();
                  Navigator.pushReplacementNamed(context, 'home');
                },
              ),
            ),
          ],
          automaticallyImplyLeading: false,
        ),
        body: Container(
          decoration: BoxDecoration(
            image: DecorationImage(
              image: NetworkImage(
                  "https://media.giphy.com/media/WoD6JZnwap6s8/giphy.gif"),
              fit: BoxFit.cover,
            ),
          ),
          child: Column(
            children: <Widget>[
              SizedBox(
                height: 40,
              ),
              Card(
                color: Colors.lightBlue,
                elevation: 25,
                child: TextField(
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 21),
                  textAlign: TextAlign.center,
                  onChanged: (val) {
                    ip = val;
                  },
                  decoration: InputDecoration(
                    border: InputBorder.none,
                    hintText: 'Enter Your IP Address',
                    hintStyle: TextStyle(
                      fontSize: 21.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ),
              ),
              SizedBox(
                height: 1,
              ),
              Card(
                color: Colors.lightBlue,
                child: Center(
                  child: FlatButton(
                    onPressed: () {
                      print(ipin);
                      setState(() {
                        ipin = ip;
                      });
                    },
                    child: Text(
                      "Click to update",
                      style:
                          TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ),
              SizedBox(
                height: 1,
              ),
              Card(
                color: Colors.lightBlue,
                child: Center(
                  child: Text(
                    "Your IP address is: \n $ipin",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              SizedBox(
                height: 10,
              ),
              Card(
                color: Colors.green,
                elevation: 25,
                child: TextField(
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 21),
                  textAlign: TextAlign.center,
                  onChanged: (val) {
                    command = val;
                  },
                  decoration: InputDecoration(
                    border: InputBorder.none,
                    hintText: 'Enter Linux Command',
                    hintStyle: TextStyle(
                      fontSize: 21.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ),
              ),
              SizedBox(
                height: 20,
              ),
              Card(
                color: Colors.red,
                child: FlatButton(
                  onPressed: () {
                    xaav();
                    run(command);
                    Future.delayed(Duration(seconds: 2), () {});
                  },
                  child: Text(
                    "Click To Run",
                    style: TextStyle(fontSize: 21, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              SizedBox(
                height: 14,
              ),
              Container(
                color: Colors.black,
                height: 197,
                width: 280,
                child: stat
                    ? (Column(
                        children: <Widget>[
                          SizedBox(
                            height: 197,
                            width: 280,
                            child: Center(
                              child: Card(
                                color: Colors.black,
                                child: CircularProgressIndicator(
                                  value: null,
                                  strokeWidth: 10.0,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ))
                    : SingleChildScrollView(
                        scrollDirection: Axis.vertical,
                        padding: EdgeInsets.fromLTRB(45, 0, 45, 0),
                        child: Text(
                          "Output\n$a", // \n $y",
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 17,
                              fontWeight: FontWeight.bold),
                          textAlign: TextAlign.center,
                        ),
                      ),
              ),
              SizedBox(
                height: 10,
              ),
              Card(
                color: Colors.red,
                child: FlatButton(
                  onPressed: () {
                    Navigator.pushNamed(context, "history");
                  },
                  child: Text(
                    "View History",
                    style: TextStyle(
                        color: Colors.black,
                        fontSize: 17,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
