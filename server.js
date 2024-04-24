const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Route for serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
});

// Route for serving account.html
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'account.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});
