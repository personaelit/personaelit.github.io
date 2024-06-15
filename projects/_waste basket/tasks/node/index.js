const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// Simulated database
let tasks = [];

// Create a new task
app.post('/tasks', (req, res) => {
  const newTask = {
    _id: uuidv4(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: []
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// Get a task by ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t._id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json(task);
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t._id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  Object.assign(task, req.body, { updated_at: new Date().toISOString() });
  res.status(200).json(task);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
