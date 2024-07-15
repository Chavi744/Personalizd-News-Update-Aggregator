const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const { name, email, password, preferences } = req.body;
    const user = new User({ name, email, password, preferences });
    await user.save();
    res.status(201).send(user);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    res.send(user);
});

app.get('/preferences', async (req, res) => {
    const { userId } = req.query;
    const user = await User.findById(userId);
    res.send(user.preferences);
});

app.put('/preferences', async (req, res) => {
    const { userId, preferences } = req.body;
    const user = await User.findByIdAndUpdate(userId, { preferences }, { new: true });
    res.send(user.preferences);
});

app.get('/user/email', async (req, res) => {
    const userId = req.query.userId;
    try {
        const user = await User.findById(userId);
        if (user) {
            res.json({ email: user.email });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).send('Server Error');
    }
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`User Service listening on port ${port}`);
});
