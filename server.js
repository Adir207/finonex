const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const AUTH_SECRET = process.env.AUTH_SECRET;
const ENCODED_SECRET = Buffer.from(AUTH_SECRET).toString('base64');
const EVENT_FILE = 'server_events.jsonl';

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

app.post('/liveEvent', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader !== ENCODED_SECRET) {
        return res.status(403).send('Forbidden');
    }

    const event = req.body;
    fs.appendFile(EVENT_FILE, JSON.stringify(event) + '\n', (err) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.send('Event received');
    });
});

app.get('/userEvents/:userid', async (req, res) => {
    const userId = req.params.userid;
    try {
        const result = await dbClient.query('SELECT * FROM users_revenue WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
