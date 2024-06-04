const fs = require('fs');
const readline = require('readline');
const { Client } = require('pg');
require('dotenv').config();

const EVENT_FILE = 'server_events.jsonl';
const BATCH_SIZE = 1000;

const dbClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || null,
    port: process.env.DB_PORT,
});

dbClient.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

async function processEvents() {
    const userRevenues = {};

    const fileStream = fs.createReadStream(EVENT_FILE);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const event = JSON.parse(line);
        const { userId, name, value } = event;
        const change = name === 'add_revenue' ? value : -value;

        if (!userRevenues[userId]) {
            userRevenues[userId] = 0;
        }
        userRevenues[userId] += change;

        if (Object.keys(userRevenues).length >= BATCH_SIZE) {
            await updateDatabase(userRevenues);
            Object.keys(userRevenues).forEach(userId => delete userRevenues[userId]);
        }
    }

    // Update remaining users in the batch
    if (Object.keys(userRevenues).length > 0) {
        await updateDatabase(userRevenues);
    }

    dbClient.end();
}

async function updateDatabase(userRevenues) {
    try {
        await dbClient.query('BEGIN');

        for (const userId in userRevenues) {
            const change = userRevenues[userId];
            await dbClient.query(
                `INSERT INTO users_revenue (user_id, revenue) 
                VALUES ($1, $2)
                ON CONFLICT (user_id) 
                DO UPDATE SET revenue = users_revenue.revenue + EXCLUDED.revenue`,
                [userId, change]
            );
        }

        await dbClient.query('COMMIT');
    } catch (err) {
        await dbClient.query('ROLLBACK');
        console.error(`Failed to update database: ${err.message}`);
    }
}

processEvents().catch(console.error);
