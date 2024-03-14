'use strict';
const crypto = require('crypto');
const readline = require('readline');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'connection_string';
const client = new MongoClient(uri);

// Function to create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Function to hash password
const hasher = (password, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return value;
};

// Function to hash password with provided salt
const hashPassword = (password, salt) => {
    if (password == null || salt == null) {
        throw new Error('Must Provide Password and salt values');
    }
    if (typeof password !== 'string' || typeof salt !== 'string') {
        throw new Error('password must be a string and salt must either be a salt string or a number of rounds');
    }
    return hasher(password, salt);
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

// Function to handle user input for username and password
const getUserInput = () => {
    return new Promise((resolve, reject) => {
        rl.question('Are you a new user? (yes/no): ', (isNewUser) => {
            if (isNewUser.toLowerCase() === 'yes') {
                rl.question('Enter username: ', (username) => {
                    rl.question('Enter password: ', (password) => {
                        rl.close();
                        resolve({ isNewUser: true, username, password });
                    });
                });
            } else if (isNewUser.toLowerCase() === 'no') {
                rl.question('Enter username: ', (username) => {
                    rl.question('Enter password: ', (password) => {
                        rl.close();
                        resolve({ isNewUser: false, username, password });
                    });
                });
            } else {
                rl.close();
                reject(new Error('Invalid input'));
            }
        });
    });
};

// Main function to execute the hashing and comparison
const main = async () => {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Get user input
        const userInput = await getUserInput();
        const { isNewUser, username, password } = userInput;

        // Access the 'users' collection in MongoDB
        const database = client.db('test');
        const collection = database.collection('user_credentials');

        if (isNewUser) {
            // Generate salt and hash password for new user
            const salt = generateSalt(12);
            const hashedPassword = hashPassword(password, salt);

            // Insert new user data into MongoDB
            await collection.insertOne({
                username: username,
                hashedpassword: hashedPassword,
                salt: salt
            });
            console.log('User data inserted into database');
        } else {
            // Retrieve all hashed passwords from MongoDB
            const hashedPasswords = await collection.find({}, { projection: { hashedpassword: 1, salt: 1 } }).toArray();

            // Compare inputted password with hashed passwords from the database
            const isMatch = await comparePasswords(password, hashedPasswords);
            console.log('Password Match:', isMatch);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Close MongoDB connection
        await client.close();
        console.log('Disconnected from MongoDB');
    }
};

// Execute main function
main();