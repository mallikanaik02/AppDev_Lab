# Experiment 14: Data Storage and Databases with SQLite

## Aim
Store and retrieve data locally using SQLite database. Extend existing applications with persistent data storage capabilities, replacing in-memory storage with database operations.

## Overview
This experiment extends previously developed applications (Calculator and To-Do List) by implementing SQLite database functionality for permanent data storage. Until now, all applications worked only in memory - once the app closes, data is lost. Real applications need to store data permanently using databases.

## Applications Developed

### 1. Calculator with SQLite History
**Extended from Experiment 4**

#### Features Implemented
- **Calculation History Storage**: Every calculation (expression, result, timestamp) is automatically saved to SQLite database when equals button is pressed
- **History View**: Dedicated history page displaying all past calculations in chronological order
- **Persistent Storage**: Calculations remain saved even after app closure and restart
- **Delete Functionality**: Individual calculations can be removed from history
- **Real-time Updates**: History updates immediately when new calculations are performed


#### Key Implementation
- SQLite database helper class for CRUD operations
- Automatic data persistence on calculation completion
- ListView implementation for history display
- Delete functionality with database synchronization

### 2. To-Do List with SQLite Storage
**Extended from Experiment 5**

#### Features Implemented
- **Task Persistence**: All tasks stored in SQLite database instead of in-memory arrays
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Data Loading**: Tasks automatically loaded from database on app startup
- **Status Management**: Task completion status tracked and updated in database
- **Permanent Storage**: Tasks survive app restarts and device reboots


#### Key Implementation
- Database helper class for task management
- Form integration with database insertion
- ListView connected to database queries
- Update and delete operations with UI synchronization

## Technical Implementation

### Database Process
1. **Create Database** → Define tables and schema
2. **Insert** → Add new data entries
3. **Query** → Retrieve and display data
4. **Update** → Modify existing entries
5. **Delete** → Remove specific records

### Technologies Used
- **Flutter/Dart** for mobile app development
- **SQLite** for local database storage
- **SQLite Helper Classes** for database operations
- **ListView/RecyclerView** for data display

## Key Learning Outcomes
- Understanding of local database storage vs in-memory storage
- Implementation of CRUD operations in mobile applications
- SQLite database design and schema creation
- Integration of database operations with user interface
- Data persistence and application lifecycle management

## Setup and Installation
1. Clone repository
2. Install Flutter dependencies: `flutter pub get`
3. Run application: `flutter run`
4. Database will be automatically created on first launch


OUTPUT:
!(14.png)
!(14a.png)
!(14b.png)




