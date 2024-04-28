const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Route for serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
});

// Route for serving account.html
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'account.html'));
});

// Route for serving lobby.html
app.get('/lobby', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'lobby.html'));
});

// Route for serving draw.html
app.get('/draw', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'draw.html'));
});

// Route for adding a new user
const {createNewAccount} = require('./firebase');

app.post('/api/signup', function (req, res) {
    createNewAccount(req.body.signupEmail, req.body.signupUsername, req.body.signupPassword, req, res);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});
