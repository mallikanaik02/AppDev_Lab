# Flutter Firebase Authentication

 Flutter app demonstrating Firebase Authentication with email/password.

## Setup Steps

1. Create Flutter app
2. Add dependencies in `pubspec.yaml`:
3. Configure Firebase Project:
- Add Android/iOS apps in Firebase Console.
- Download `google-services.json` for Android, put in `android/app`.
- Download `GoogleService-Info.plist` for iOS, add to Xcode.
- Generate `firebase_options.dart` using FlutterFire CLI or manually.
4. Initialize Firebase in `main.dart`:
5. Create Login, Signup, and Forgot Password Screens using Firebase Auth APIs (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `sendPasswordResetEmail`).
6. Run app

  Output:
    ![auth](f1.png)
      ![auth](f2.png)
      ![auth](f3.png)
      ![auth](f4.png)
      ![auth](f5.png)
      ![auth](f6.png)
  


