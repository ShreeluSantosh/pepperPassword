'use strict';
const crypto = require('crypto');
const express = require('express');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'connection_string';
const client = new MongoClient(uri);

const app = express();
const port = 3000;

app.use(express.json());

// Function to generate salt
const generateSalt = (rounds) => {
    if (rounds >= 15) {
        throw new Error(`${rounds} is greater than 15, Must be less than 15`);
    }
    if (typeof rounds !== 'number') {
        throw new Error('rounds param must be a number');
    }
    if (rounds == null) {
        rounds = 12;
    }
    return crypto.randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds);
};

const pepper = 'pepper_value';

// Function to hash password
const hasher = (password, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return value;
};

const pepper_hash = (h1, pepper) => {
    const hash1 = crypto.createHmac('sha512', pepper);
    hash1.update(h1);
    const value = hash1.digest('hex');
    return value;
}

// Function to hash password with provided salt
const hashPassword = (password, salt) => {
    if (password == null || salt == null) {
        throw new Error('Must Provide Password and salt values');
    }
    if (typeof password !== 'string' || typeof salt !== 'string') {
        throw new Error('password must be a string and salt must either be a salt string or a number of rounds');
    }
    let h1 = hasher(password, salt);
    let h2 = pepper_hash(h1, pepper);
    return hasher(h1, h2);
};

// Function to compare password with its hash
const comparePasswords = async (password, hashedPasswords) => {
    for (const hashObj of hashedPasswords) {
        const hashedPassword = hashPassword(password, hashObj.salt);
        if (hashedPassword === hashObj.hashedpassword) {
            return true; // Match found
        }
    }
    return false; // No match found
};

// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

// Express endpoint for signup
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Access the 'users' collection in MongoDB
        const database = client.db('test');
        const collection = database.collection('user_credentials');

        // Check if user already exists
        const existingUser = await collection.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate salt and hash password for new user
        const salt = generateSalt(12);
        const hashedPassword = hashPassword(password, salt, 'pepper_value');

        // Insert new user data into MongoDB
        await collection.insertOne({
            username: username,
            hashedpassword: hashedPassword,
            salt: salt
        });

        res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Access the 'users' collection in MongoDB
        const database = client.db('test');
        const collection = database.collection('user_credentials');

        // Find user by username
        const user = await collection.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Compare inputted password with hashed password from the database
        const hashedPassword = hashPassword(password, user.salt, 'pepper_value');
        if (hashedPassword !== user.hashedpassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the Express server
const startServer = () => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

// Initialize MongoDB connection and start the server
connectToMongoDB().then(startServer);