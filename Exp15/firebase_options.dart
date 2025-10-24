import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError('DefaultFirebaseOptions are not supported for this platform.');
    }
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyBn0dW-4AFakeKeyForAndroidApp2025XXZ',
    appId: '1:1234567890:android:abcd1234efgh5678ijkl90',
    messagingSenderId: '1234567890',
    projectId: 'flutter-firebase-calculator',
    storageBucket: 'flutter-firebase-calculator.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyA-iosFAKE-KEY-5678zzxXYZa',
    appId: '1:1234567890:ios:abcd5678lmno9123',
    messagingSenderId: '1234567890',
    projectId: 'flutter-firebase-calculator',
    storageBucket: 'flutter-firebase-calculator.appspot.com',
    iosBundleId: 'com.mallikanaik.calculator',
  );

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyCz-WEB-FAKEKEY-2025-KLmnoPq1234',
    appId: '1:1234567890:web:abcd9876efgh1234mnop56',
    messagingSenderId: '1234567890',
    projectId: 'flutter-firebase-calculator',
    authDomain: 'flutter-firebase-calculator.firebaseapp.com',
    storageBucket: 'flutter-firebase-calculator.appspot.com',
    measurementId: 'G-FAKEMEASURE123',
  );
}
