const express = require('express');
const path = require('path');
const router = express.Router();
const app = require('../../app');

// Route for serving index.html
app.get('/', (req, res) => {
    console.log('Route: Home')
    console.log(`Express route accessed with Session ID: ${req.sessionID} on \'/\'`);
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Route for serving account.html
app.get('/account', (req, res) => {
    console.log('Route: Account')
    console.log(`Express route accessed with Session ID: ${req.sessionID} on \'/account\'`);
    res.sendFile(path.join(__dirname, '..', 'views', 'account.html'));
});

// Route for serving lobby.html
app.get('/lobby', (req, res) => {
    console.log('Route: Lobby')
    res.sendFile(path.join(__dirname, '..', 'views', 'lobby.html'));
});

// Route for serving draw.html
app.get('/draw', (req, res) => {
    console.log('Route: Draw')
    console.log(`Express route accessed with Session ID: ${req.sessionID} on \'/draw\'`);
    res.sendFile(path.join(__dirname, '..', 'views', 'draw.html'));
});

module.exports = router;
