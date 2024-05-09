const http = require('http');
const app = require('./app');
const serverLogic = require('./socket');
const session = require('express-session'); // Require the session middleware
const server = http.createServer(app);

// === Express session middleware ===
const sessionMiddleware = session({
    secret: "averylongsecretkeythatshouldnotbeexposedtoanyone",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
});

app.use(sessionMiddleware);
const io = require('socket.io')(server);
io.engine.use(sessionMiddleware);

// === Socket.IO logic ===
const userNames = new Map();
const rooms = new Map();

serverLogic(io, userNames, rooms);

// === Routes ===
const routes = require('./src/routes/routes');
app.use('/', routes);

// Route for adding a new user
const { createNewAccount } = require('./public/scripts/classes/firebase');

app.post('/api/signup', function (req, res) {
    createNewAccount(req.body.signupEmail, req.body.signupUsername, req.body.signupPassword, req, res)
    .then(() => {
        // Set isLoggedIn to true in the session
        req.session.isLoggedIn = true;
        res.redirect('/game');
    })
    .catch((error) => {
        // It's a good practice to handle errors and send an appropriate response
        console.error('SignUp failed:', error);
        res.status(401).send('SignUp failed');
    });
})

// Route for logging in a user
const { loginEmailPassword } = require('./public/scripts/classes/firebase');

// Route for logging in a user
app.post('/api/login', function (req, res) {
    loginEmailPassword(req.body.loginEmail, req.body.loginPassword, req, res)
        .then(() => {
            // Set isLoggedIn to true in the session
            req.session.isLoggedIn = true;
            res.redirect('/game');
        })
        .catch((error) => {
            // It's a good practice to handle errors and send an appropriate response
            console.error('Login failed:', error);
            res.status(401).send('Login failed');
        });
});

const { loginGuest } = require('./public/scripts/classes/firebase');
app.post('/api/guestLogin', function (req, res) {
    loginGuest(req.body.guestUsername, req, res)
    .then(() => {
        // Set isLoggedIn to true in the session
        req.session.isLoggedIn = true;
        res.redirect('/game');
    })
    .catch((error) => {
        // It's a good practice to handle errors and send an appropriate response
        console.error('Guest Login failed:', error);
        res.status(401).send('Login failed');
    });
})

// === Server Port ===
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});
