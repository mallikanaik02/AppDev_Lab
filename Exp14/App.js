import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.trim(),
          description: newDescription.trim()
        })
      });
      
      if (response.ok) {
        setNewTask('');
        setNewDescription('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    
    try {
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: newStatus
        })
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1> My Tasks</h1>
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
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-section">
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
            <div className="empty-icon">📝</div>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started!</p>
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


function TaskCard({ task, onToggle, onDelete }) {
  const isCompleted = task.status === 'completed';

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
          {new Date(task.timestamp).toLocaleDateString()}
        </span>
        <span className={`status-badge ${task.status}`}>
          {task.status === 'pending' ? '⏳ To Do' : '✨ Done'}
        </span>
      </div>
    </div>
  );
}

export default App;
