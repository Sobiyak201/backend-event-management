const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

// Get all events (to use for fetching events)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const events = await Event.find({ ownerId: req.user.id });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a new event
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, date } = req.body;
        const newEvent = new Event({ name, date, ownerId: req.user.id });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Edit an event by ID
router.put('/:id', authMiddleware, authorize(['user', 'admin']), async (req, res) => {
    try {
        const { name, date } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { name, date }, { new: true });
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete an event by ID
router.delete('/:id', authMiddleware, authorize(['user', 'admin']), async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
