import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  const API_URL = process.env.REACT_APP_API_URL; // Base URL for API requests

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`);
      setTasks(response.data.reverse());
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await axios.post(`${API_URL}/api/tasks`, { description: newTask });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`${API_URL}/api/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditingTask = (taskId, currentDescription) => {
    setEditingTaskId(taskId);
    setEditDescription(currentDescription);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditDescription('');
  };

  const saveTaskEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/api/tasks/${editingTaskId}`, { description: editDescription });
      setEditingTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  return (
    <div className="app-container">
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <h1 className="ultra-regular">todo</h1>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/morpole/reactversion_yetanothertodoapp.git"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-100 hover:text-gray-300"
            title="Visit my GitHub repo"
          >
            <i className="bi bi-github text-xl"></i>
          </a>
        </div>
      </header>

      <div className="container">
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
            className="task-input"
          />
          <button type="submit" className="add-task-btn">+</button>
        </form>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className={`task-item ${editingTaskId === task._id ? 'editing' : ''}`}>
              <div className="task-content">
                <button
                  onClick={() => toggleComplete(task._id, task.completed)}
                  className="completion-btn"
                >
                  <i className="material-icons-outlined">
                    {task.completed ? 'check_circle' : 'radio_button_unchecked'}
                  </i>
                </button>
                <span className={`task-description ${task.completed ? 'completed' : ''}`}>
                  {task.description}
                </span>
              </div>
              {editingTaskId !== task._id && (
                <div className="task-actions">
                  <button onClick={() => startEditingTask(task._id, task.description)} className="edit-task">
                    <i className="material-icons-outlined">edit</i>
                  </button>
                  <button onClick={() => deleteTask(task._id)} className="delete-task">
                    <i className="material-icons-round">delete_outline</i>
                  </button>
                </div>
              )}
              {editingTaskId === task._id && (
                <form onSubmit={saveTaskEdit} className="edit-task-form p-4 bg-gray-700 rounded-lg mt-2">
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-gray-100"
                    placeholder="Edit task description"
                    required
                  />
                  <div className="edit-task-form-buttons">
                    <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">Save Edit</button>
                    <button type="button" onClick={cancelEdit} className="mt-2 bg-red-500 text-white p-2 rounded">Cancel</button>
                  </div>
                </form>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;