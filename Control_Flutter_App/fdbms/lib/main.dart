import 'filemaincode.dart';
import 'screens/history.dart';
import 'screens/splash.dart';
import 'screens/home.dart';
import 'screens/reg.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: "splash",
      routes: {
        "splash": (context) => splash(),
        "home": (context) => MyHome(),
        "reg": (context) => MyReg(),
        "linux": (context) => MyApp(),
        "history": (context) => MyHistory(),
      },
    ),
  );
}
