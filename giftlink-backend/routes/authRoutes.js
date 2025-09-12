const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pino = require('pino'); // Import Pino logger
const connectToDatabase = require('../models/db');
dotenv.config();

const logger = pino(); // Logger instance

const JWT_SECRET = process.env.JWT_SECRET;

// ----------- User Registration -----------
router.post('/register', async (req, res) => {
    try {
        // Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Check for existing email
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            logger.error('Email already exists');
            return res.status(400).json({ error: 'Email already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        // Save user details
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({ authtoken, email: req.body.email });
    } catch (e) {
         logger.error('Registration error: ' + e.message);
         return res.status(500).send('Internal server error');
    }
});

// ----------- User Login -----------
router.post('/login', async (req, res) => {
    try {
        // Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Check user credentials
        const theUser = await collection.findOne({ email: req.body.email });

        if (!theUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(req.body.password, theUser.password);
        if (!isMatch) {
            logger.error('Passwords do not match');
            return res.status(404).json({ error: 'Wrong password' });
        }

        const userName = theUser.firstName;
        const userEmail = theUser.email;

        const payload = {
            user: {
                id: theUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({ authtoken, userName, userEmail });
    } catch (e) {
        logger.error('Login error: ' + e.message);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
