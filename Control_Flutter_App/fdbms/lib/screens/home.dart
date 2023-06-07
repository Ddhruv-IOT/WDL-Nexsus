import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/services.dart';

class MyHome extends StatefulWidget {
  @override
  _MyHomeState createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> {
  var authc = FirebaseAuth.instance;
  String email;
  String password;
  var stop;

  // ignore: unused_field
  bool _initialized = false;
  // ignore: unused_field
  bool _error = false;
  // Define an async function to initialize FlutterFire

  void initializeFlutterFire() async {
    try {
      await Firebase.initializeApp();
      setState(() {
        _initialized = true;
      });
    } catch (e) {
      setState(() {
        _error = true;
      });
    }
  }

  login() async {
    print(email);
    print(password);
    try {
      var signIn = await authc.signInWithEmailAndPassword(
          email: email, password: password);
      print(signIn);

      if (signIn != null) {
        setState(() {
          stop = "Signin successful!";
        });
        await Future.delayed(Duration(seconds: 2), () {
          Navigator.pushNamed(context, "linux");
        });
      } else {
        print("signin ");
        setState(() {
          stop = "Signin Failed!";
        });
      }
    } catch (e) {
      setState(() {
        stop = e;
        print(stop);
      });
      print("**************exception:$e******************");
    }
    if (stop.toString() ==
        "[firebase_auth/user-not-found] There is no user record corresponding to this identifier. The user may have been deleted.") {
      await Future.delayed(Duration(seconds: 5), () {
        Navigator.pushNamed(context, "reg");
      });
    }
  }

  @override
  void initState() {
    initializeFlutterFire();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue,
      resizeToAvoidBottomPadding: false,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Text(
          'Login | Register',
          style: TextStyle(color: Colors.lime),
        ),
        actions: <Widget>[
          IconTheme(
            data: IconThemeData(color: Colors.lime),
            child: IconButton(
              icon: Icon(Icons.exit_to_app),
              onPressed: () {
                SystemNavigator.pop();
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
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            SizedBox(
              height: 120,
            ),
            Center(
              child: Container(
                width: 300,
                child: Center(
                  child: Card(
                    color: Colors.green,
                    child: Column(
                      children: <Widget>[
                        Container(
                          width: 300,
                          child: Center(
                            child: Card(
                              color: Colors.deepPurple[50],
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                "  Already a user login here  ",
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 21),
                              ),
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Container(
                          width: 300,
                          child: Center(
                            child: Card(
                              color: Colors.deepPurple[100],
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: TextField(
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 21),
                                textAlign: TextAlign.center,
                                onChanged: (value) {
                                  email = value;
                                },
                                keyboardType: TextInputType.emailAddress,
                                decoration: InputDecoration(
                                  border: InputBorder.none,
                                  hintText: 'Enter email address',
                                  hintStyle: TextStyle(
                                    fontSize: 21.0,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        Center(
                          child: Container(
                            width: 300,
                            child: Card(
                              color: Colors.deepPurple[200],
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: TextField(
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 21),
                                textAlign: TextAlign.center,
                                obscureText: true,
                                onChanged: (value) {
                                  password = value;
                                },
                                decoration: InputDecoration(
                                  border: InputBorder.none,
                                  hintText: 'Enter Your password',
                                  hintStyle: TextStyle(
                                    fontSize: 21.0,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Builder(
                          builder: (BuildContext context) => Material(
                            color: Colors.deepPurple[300],
                            borderRadius: BorderRadius.circular(12),
                            child: MaterialButton(
                              onPressed: () {
                                login();
                                Future.delayed(Duration(seconds: 2), () {
                                  Scaffold.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('*******$stop**********'),
                                      duration: Duration(seconds: 3),
                                    ),
                                  );
                                });
                              },
                              child: Text(
                                'Sign in',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Center(
              child: Container(
                width: 300,
                child: Card(
                  color: Colors.green,
                  child: Column(
                    children: <Widget>[
                      Card(
                        color: Colors.deepPurple[200],
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          "Not registered user register here!",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 21),
                        ),
                      ),
                      Material(
                        color: Colors.deepPurple[300],
                        borderRadius: BorderRadius.circular(12),
                        child: MaterialButton(
                          onPressed: () {
                            print('going to reg screen');
                            Navigator.pushNamed(context, "reg");
                          },
                          child: Text(
                            'Sign up',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
