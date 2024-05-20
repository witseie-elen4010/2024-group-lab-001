const express = require('express');
const path = require('path');
const router = express.Router();
const app = require('../../app');

// Middleware for Login - Cannot access /game without being logged in
const requireLogin = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        // User is authenticated, proceed to the next middleware
        next();
    } else {
        // User is not authenticated, redirect to login page
        // Server side
        res.redirect('/account?alert=Unauthorized. Please login first.');
        //res.status(401).send('Unauthorized. Please login first.');
    }
};

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
app.get('/game', requireLogin, (req, res) => {
    console.log('Route: game')
    res.sendFile(path.join(__dirname, '..', 'views', 'game.html'));
});

// Route for serving draw.html
app.get('/draw', (req, res) => {
    console.log('Route: Draw')
    console.log(`Express route accessed with Session ID: ${req.sessionID} on \'/draw\'`);
    res.sendFile(path.join(__dirname, '..', 'views', 'draw.html'));
});

module.exports = router;
