import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Make sure you have this file for styling

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tasks'); // Relative path using proxy
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
      alert('Failed to fetch tasks from server.');
    } finally {
      setLoading(false);
    }
  };

  // Add or update task
  const handleAddTask = async () => {
    if (!taskInput.trim()) {
      alert('Task cannot be empty!');
      return;
    }
    try {
      if (editId) {
        console.log('Updating task:', editId, taskInput);
        await axios.put(`/tasks/${editId}`, { title: taskInput });
        setEditId(null);
      } else {
        console.log('Adding task:', taskInput);
        await axios.post('/tasks', { title: taskInput });
      }
      setTaskInput('');
      fetchTasks();
    } catch (err) {
      console.error('Error adding/updating task:', err.message);
      alert('Failed to add or update task.');
    }
  };

  // Prepare task for editing
  const handleEditTask = (task) => {
    setTaskInput(task.title);
    setEditId(task._id);
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      console.log('Deleting task:', id);
      await axios.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err.message);
      alert('Failed to delete task.');
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (task) => {
    try {
      await axios.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error('Error toggling task:', err.message);
      alert('Failed to update task status.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">My To-Do List</h1>

      <div className="input-container">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a new task..."
          className="task-input"
        />
        <button onClick={handleAddTask} className="add-btn">
          {editId ? 'Update' : 'Add'}
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading tasks...</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <span onClick={() => handleToggleComplete(task)}>{task.title}</span>
              <div className="task-actions">
                <button onClick={() => handleEditTask(task)} className="edit-btn">Edit</button>
                <button onClick={() => handleDeleteTask(task._id)} className="delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
