import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Real-time listener for Firebase Firestore
  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tasks: ", error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // CREATE: Add task to Firestore
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTask.trim(),
        description: newDescription.trim(),
        status: 'pending',
        timestamp: new Date()
      });
      
      setNewTask('');
      setNewDescription('');
      console.log('Task added to Firestore!');
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  // UPDATE: Toggle task status in Firestore
  const toggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        status: newStatus
      });
      console.log('Task updated in Firestore!');
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  // DELETE: Remove task from Firestore
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      console.log('Task deleted from Firestore!');
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <h2>🔄 Connecting to Firebase...</h2>
          <p>Loading your tasks from the cloud</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>☁️ Cloud Tasks</h1>
          <p>Powered by Firebase Firestore - Real-time & Offline Ready</p>
        </div>
      </header>

      {/* Add Task Section */}
      <div className="add-section">
        <div className="add-card">
          <h2>➕ Create New Task</h2>
          <div className="input-group">
            <input 
              type="text"
              placeholder="What needs to be done?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="task-input"
            />
            <textarea 
              placeholder="Add some details... (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="desc-input"
              rows="3"
            />
            <button onClick={addTask} className="add-btn">
              <span>Save to Cloud ☁️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="controls-section">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'tab active' : 'tab'}
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button 
            className={filter === 'pending' ? 'tab active' : 'tab'}
            onClick={() => setFilter('pending')}
          >
            To Do ({tasks.filter(t => t.status === 'pending').length})
          </button>
          <button 
            className={filter === 'completed' ? 'tab active' : 'tab'}
            onClick={() => setFilter('completed')}
          >
            Done ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="tasks-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">☁️</div>
            <h3>{tasks.length === 0 ? 'No tasks in cloud yet' : 'No matching tasks'}</h3>
            <p>{tasks.length === 0 ? 'Create your first cloud task!' : 'Try a different search or filter'}</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleStatus}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Firebase-powered Task Card Component
function TaskCard({ task, onToggle, onDelete }) {
  const isCompleted = task.status === 'completed';
  
  // Format Firebase timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className={`task-card ${isCompleted ? 'completed' : 'pending'}`}>
      <div className="card-header">
        <button 
          className={`status-btn ${isCompleted ? 'done' : 'todo'}`}
          onClick={() => onToggle(task)}
        >
          {isCompleted ? '✅' : '⭕'}
        </button>
        <button 
          className="delete-btn"
          onClick={() => onDelete(task.id)}
        >
          🗑️
        </button>
      </div>
      
      <div className="card-content">
        <h3 className={isCompleted ? 'completed-text' : ''}>{task.title}</h3>
        {task.description && (
          <p className={`description ${isCompleted ? 'completed-text' : ''}`}>
            {task.description}
          </p>
        )}
      </div>
      
      <div className="card-footer">
        <span className="timestamp">
          {formatDate(task.timestamp)}
        </span>
        <span className={`status-badge ${task.status}`}>
          {task.status === 'pending' ? '⏳ To Do' : '✨ Done'}
        </span>
        <span className="firebase-badge">☁️ Firestore</span>
      </div>
    </div>
  );
}

export default App;
