const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users - Create a new user
router.post('/users', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json(existingUser);
        }

        // Create new user
        const newUser = new User({ username });
        const savedUser = await newUser.save();

        return res.json({
            username: savedUser.username,
            _id: savedUser._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/users - Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '_id username');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/users/:_id/exercises - Add an exercise to a user
router.post('/users/:_id/exercises', async (req, res) => {
    try {
        const { description, duration, date } = req.body;
        const userId = req.params._id;

        if (!description || !duration) {
            return res.status(400).json({ error: 'Description and duration are required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Parse duration as integer
        const durationNum = parseInt(duration);
        if (isNaN(durationNum)) {
            return res.status(400).json({ error: 'Duration must be a number' });
        }

        // Create exercise object
        const exercise = {
            description,
            duration: durationNum,
            date: date ? new Date(date) : new Date()
        };

        // Add exercise to user's log
        user.log.push(exercise);
        await user.save();

        // Format response to match expected output
        return res.json({
            username: user.username,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(),
            _id: user._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/users/:_id/logs - Get exercise log for a user
router.get('/users/:_id/logs', async (req, res) => {
    try {
        const { from, to, limit } = req.query;
        const userId = req.params._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Filter logs based on date range (if provided)
        let log = user.log;

        if (from) {
            const fromDate = new Date(from);
            if (!isNaN(fromDate.getTime())) {
                log = log.filter(exercise => exercise.date >= fromDate);
            }
        }

        if (to) {
            const toDate = new Date(to);
            if (!isNaN(toDate.getTime())) {
                log = log.filter(exercise => exercise.date <= toDate);
            }
        }

        // Apply limit if provided
        if (limit) {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum)) {
                log = log.slice(0, limitNum);
            }
        }

        // Format the log to match expected output
        const formattedLog = log.map(exercise => ({
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString()
        }));

        return res.json({
            username: user.username,
            count: formattedLog.length,
            _id: user._id,
            log: formattedLog
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;