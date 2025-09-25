
# Todo App with Firebase - Experiment 10

A modern, real-time to-do list application built with React and Firebase Firestore. Features cloud synchronization, offline support, and a beautiful Pinterest-style interface.

## Features

- Real-time Sync: Changes appear instantly across all devices
- Cloud Storage: Data stored in Firebase Firestore
- Offline Support: Works without internet, syncs when reconnected
- Search & Filter: Find tasks quickly with built-in search
- Pinterest-style UI: Beautiful card-based layout with animations
- Status Tracking: Organize tasks by pending/completed status

## Technologies Used

- Frontend: React, CSS3 with Flexbox/Grid
- Backend: Firebase Firestore (NoSQL database)
- Real-time: Firebase onSnapshot listeners
- Styling: Custom CSS with gradients and animations

## Installation & Setup

1. Clone and install dependencies:

2. Configure Firebase:
- Create Firebase project at console.firebase.google.com
- Enable Firestore in test mode
- Copy config keys to src/firebase.js

3. Run the application:

## Key Functionality

- CREATE: Add tasks with title and description
- READ: Real-time task loading from Firestore
- UPDATE: Toggle task completion status
- DELETE: Remove tasks from cloud database
- SEARCH: Filter tasks by title/description



