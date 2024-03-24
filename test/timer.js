const crypto = require('crypto');
const { MongoClient } = require('mongodb');

// MongoDB connection URL
const uri = 'connection_string';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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

// Function to generate random pepper
const generateRandomPepper = () => {
    return crypto.randomBytes(16).toString('hex');
};

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
const hashPassword = (password, salt, pepper) => {
    if (password == null || salt == null || pepper == null) {
        throw new Error('Must Provide Password, salt, and pepper values');
    }
    if (typeof password !== 'string' || typeof salt !== 'string' || typeof pepper !== 'string') {
        throw new Error('password, salt, and pepper must be strings');
    }
    let h1 = hasher(password, salt);
    let h2 = pepper_hash(h1, pepper);
    return hasher(h1, h2);
};

// Function to check if the timer is up
async function checkTimerAndUpdate(user) {
    const currentDate = new Date();
    const lastLoginDate = new Date(user.lastLogin);

    // Calculate milliseconds until the next execution (90 days)
    const millisecondsInADay = 1000; // 1 day in milliseconds
    const millisecondsIn90Days = millisecondsInADay;

    // If the difference between the current date and last login date is greater than or equal to 90 days
    if ((currentDate - lastLoginDate) >= millisecondsIn90Days) {
        // Rehash the password
        const newSalt = generateSalt(12);
        const newPepper = generateRandomPepper();
        const newPasswordHash = hashPassword(user.password, newSalt, newPepper);

        // Update the user's password hash and salt in the database
        const db = client.db('your_database_name');
        const usersCollection = db.collection('users');
        await usersCollection.updateOne({ _id: user._id }, { $set: { salt: newSalt, password: newPasswordHash, lastLogin: currentDate } });
        console.log(`Password rehashed for user ${user.username}`);
    }
}

// Function to authenticate user
async function authenticateUser(username, password) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('test');
        const usersCollection = db.collection('user_credentials');
        
        // Find user by username
        const user = await usersCollection.findOne({ username });

        if (!user) {
            console.log('User not found');
            return;
        }

        // Check if timer is up and rehash password if necessary
        await checkTimerAndUpdate(user);

        // Verify password
        const hashedPassword = hashPassword(password, user.salt, user.pepper);
        if (hashedPassword === user.password) {
            console.log('User authenticated successfully');
        } else {
            console.log('Invalid password');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

// Example usage: authenticate user
authenticateUser('shreelu', 'wisdom');

