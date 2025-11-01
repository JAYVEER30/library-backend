const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

router.post('/register', async (req, res) => {
  try {
    const { name, username, password, email, mobile, admin } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });

    let existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'username already taken' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = new User({ name, username, password: hashed, email, mobile, admin: !!admin });
    await user.save();
    res.json({ message: 'User registered', user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, username: user.username, admin: user.admin };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
