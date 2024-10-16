const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Create a new task
router.post('/', async (req, res) => {
    try {
        const task = new Task({
            description: req.body.description,
            completed: false
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a task
router.patch('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (updatedTask) {
            res.status(200).json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (deletedTask) {
            res.status(200).json({ message: 'Task deleted.' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;