const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());

// Initialize the login data store
const loginDataStore = []; // Store login data locally

const webhookUrl = "https://webhook.site/55735d4c-4dd8-447a-9758-b50e87a3c96a";
const webhookRequestsUrl = "https://webhook.site/token/55735d4c-4dd8-447a-9758-b50e87a3c96a/requests"; // URL for fetching webhook requests

// Endpoint to handle incoming login data and forward it to the webhook
app.post('/send-login-data', (req, res) => {
    console.log('Received login data:', req.body);

    const { email, timestamp, message } = req.body;

    // Store login data locally
    loginDataStore.push({ email, timestamp, message });

    // Forward the login data to the webhook
    axios.post(webhookUrl, { email, timestamp, message })
        .then(() => {
            res.status(200).send('Login data sent to webhook successfully.');
        })
        .catch((error) => {
            console.error('Error sending login data to webhook:', error);
            res.status(500).send('Error sending login data to webhook');
        });
});

// Endpoint to handle incoming search data and forward it to the webhook
app.post('/send-search-data', (req, res) => {
    console.log('Received search data:', req.body);

    const { searchQuery, timestamp, userEmail, mapName } = req.body;

    // Store search data locally (similar to login data storage)
    loginDataStore.push({ searchQuery, timestamp, userEmail, mapName});

    // Forward the search data to the webhook
    axios.post(webhookUrl, { searchQuery, timestamp, userEmail, mapName })
        .then(() => {
            res.status(200).send('Search data sent to webhook successfully.');
        })
        .catch((error) => {
            console.error('Error sending search data to webhook:', error);
            res.status(500).send('Error sending search data to webhook');
        });
});

// Endpoint to retrieve locally stored login data
app.get('/stored-logs', (req, res) => {
    res.status(200).json({ notifications: loginDataStore });
});

// Endpoint to fetch login notifications
app.get('/logs/login', (req, res) => {
    axios.get(webhookRequestsUrl)
        .then(response => {
            const loginNotifications = response.data.data.filter(entry => {
                const content = JSON.parse(entry.content);
                return content.email !== undefined;  // Filter by presence of `email` key
            });
            res.status(200).json({ data: loginNotifications });
        })
        .catch(error => {
            console.error('Error fetching login notifications:', error);
            res.status(500).send('Error fetching login notifications');
        });
});

// Endpoint to fetch search notifications
app.get('/logs/search', (req, res) => {
    axios.get(webhookRequestsUrl)
        .then(response => {
            const searchNotifications = response.data.data.filter(entry => {
                const content = JSON.parse(entry.content);
                return content.mapName !== undefined;  // Filter by presence of `mapName` key
            });
            res.status(200).json({ data: searchNotifications });
        })
        .catch(error => {
            console.error('Error fetching search notifications:', error);
            res.status(500).send('Error fetching search notifications');
        });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
