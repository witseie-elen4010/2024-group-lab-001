const http = require('http');
const app = require('./app');
const {serverLogic}  = require('./socket');
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

// Route to handle cookie consent
app.post('/accept-cookies', (req, res) => {
    // Set a session variable to indicate user's consent
    req.session.cookiesAccepted = true;
    console.log('Cookie consent accepted.');
});

// Middleware to check consent on each request
app.use((req, res, next) => {
    // Check if the user has previously accepted cookies
    if (!req.session.cookiesAccepted) {
        // Render a cookie consent banner here or take appropriate action
        // For simplicity, let's just log a message
        console.log('Cookie consent not yet accepted.');
    }
    next();
});

// Route for adding a new user
const { createNewAccount } = require('./public/scripts/classes/firebase');

app.post('/api/signup', function (req, res) {
    createNewAccount(req.body.signupEmail, req.body.signupUsername, req.body.signupPassword, req, res)
    .then(() => {
        // Save username in session
        req.session.username = req.body.signupUsername;
        log('Session Username Saved As:', req.session.username);
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
const { getUsername } = require('./public/scripts/classes/firebase');

// Route for logging in a user
app.post('/api/login', function (req, res) {
    loginEmailPassword(req.body.loginEmail, req.body.loginPassword, req, res)
        .then(async () => {
            // Retrieve username
            const username = await getUsername();
            if (username) {
                // Set username and isLoggedIn to true in the session
                req.session.username = username;
                log('Session Username Saved As:', req.session.username);
                req.session.isLoggedIn = true;
                res.redirect('/game');
            } else {
                // If username not found, handle appropriately
                console.error('Username not found.');
                res.status(401).send('Username not found');
            }
        })
        .catch((error) => {
            // It's a good practice to handle errors and send an appropriate response
            console.error('Login failed:', error);
            res.status(401).send('Login failed');
        });
});

const { loginGuest } = require('./public/scripts/classes/firebase');
const { log } = require('console');
app.post('/api/guestLogin', function (req, res) {
    loginGuest(req.body.guestUsername, req, res)
    .then(() => {
        // Set isLoggedIn to true in the session
        req.session.isLoggedIn = true;
        // Save username in session
        req.session.username = req.body.guestUsername;
        log('Session Username Saved As:', req.session.username);
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
