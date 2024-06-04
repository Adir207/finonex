const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const AUTH_SECRET = process.env.AUTH_SECRET;
const ENCODED_SECRET = Buffer.from(AUTH_SECRET).toString('base64');
const EVENT_FILE = 'events.jsonl';
const SERVER_URL = 'http://localhost:8000/liveEvent';

fs.readFile(EVENT_FILE, 'utf8', (err, data) => {
    if (err) throw err;
    const events = data.trim().split('\n').map(JSON.parse);

    events.forEach(async (event) => {
        try {
            await axios.post(SERVER_URL, event, {
                headers: { 'Authorization': ENCODED_SECRET }
            });
            console.log(`Event for user ${event.userId} sent successfully.`);
        } catch (err) {
            console.error(`Failed to send event for user ${event.userId}: ${err.message}`);
        }
    });
});
