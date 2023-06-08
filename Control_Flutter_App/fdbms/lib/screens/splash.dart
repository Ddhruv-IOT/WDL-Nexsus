import 'package:flutter/material.dart';
import 'package:splashscreen/splashscreen.dart';

import 'home.dart';

// ignore: camel_case_types
class splash extends StatefulWidget {
  @override
  _splashState createState() => new _splashState();
}

// ignore: camel_case_types
class _splashState extends State<splash> {
  @override
  Widget build(BuildContext context) {
    return new SplashScreen(
        seconds: 5,
        title: new Text(
          'Welcome to Fire CMD',
          style: TextStyle(
              color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
        ),
        navigateAfterSeconds: new AfterSplash(),
        image: new Image.network(
            'https://media.giphy.com/media/WoD6JZnwap6s8/giphy.gif'),
        backgroundColor: Colors.black,
        styleTextUnderTheLoader: new TextStyle(),
        photoSize: 220.0,
        onClick: () => print("Welcome TO Fire CMD"),
        loaderColor: Colors.red);
  }
}

class AfterSplash extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MyHome();
  }
}
