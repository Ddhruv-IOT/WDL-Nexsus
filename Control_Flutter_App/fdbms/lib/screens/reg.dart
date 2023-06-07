import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class MyReg extends StatefulWidget {
  @override
  _MyRegState createState() => _MyRegState();
}

class _MyRegState extends State<MyReg> {
  var authc = FirebaseAuth.instance;
  String email;
  String password;
  var x;

  account() async {
    try {
      var user = await authc.createUserWithEmailAndPassword(
          email: email, password: password);

      print(user);
      if (user != null) {
        setState(() {
          x = "Done you are registered now";
          var ipd = authc.currentUser.uid;
          print("**********$ipd**************");
        });
        Future.delayed(Duration(seconds: 5), () {
          Navigator.pushNamed(context, "linux");
        });
      }
    } catch (e) {
      print("exception case *******$e**********");
      setState(() {
        x = e;
      });
    }
    return x;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomPadding: false,
      appBar: AppBar(
        title: Text(
          'Registration',
          style: TextStyle(color: Colors.lime),
        ),
        backgroundColor: Colors.black,
      ),
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: NetworkImage(
                'https://media.giphy.com/media/WoD6JZnwap6s8/giphy.gif'),
            fit: BoxFit.cover,
          ),
        ),
        child: Center(
          child: Container(
            height: 250,
            width: 300,
            child: Center(
              child: Card(
                color: Colors.blue[900],
                child: Column(
                  children: <Widget>[
                    SizedBox(
                      height: 10,
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Card(
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
                    SizedBox(
                      height: 10,
                    ),
                    Card(
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
                    SizedBox(
                      height: 10,
                    ),
                    Builder(
                      builder: (BuildContext context) => Material(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(12),
                        child: MaterialButton(
                          onPressed: () {
                            account();
                            Future.delayed(Duration(seconds: 2), () {
                              Scaffold.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('*******$x**********'),
                                  duration: Duration(seconds: 3),
                                ),
                              );
                            });
                          },
                          child: Text('Sign up'),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
