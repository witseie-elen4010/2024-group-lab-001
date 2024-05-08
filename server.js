const http = require('http');
const app = require('./app');
const serverLogic = require('./socket');
const session = require('express-session'); // Require the session middleware

const server = http.createServer(app);
const sessionMiddleware = session({
    secret: "averylongsecretkeythatshouldnotbeexposedtoanyone",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }, // Adjust the cookie settings as needed
    // Store additional session data
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    // Add isRedirected to the session data
    isRedirected: false,
});

app.use(sessionMiddleware);
const io = require('socket.io')(server);
io.engine.use(sessionMiddleware);

const userNames = new Map();
const rooms = new Map();

// Socket.IO logic
serverLogic(io, userNames, rooms);

// Routes
const routes = require('./src/routes/routes');
app.use('/', routes);

// Route for adding a new user
const { createNewAccount } = require('./public/scripts/classes/firebase');

app.post('/api/signup', function (req, res) {
    createNewAccount(req.body.signupEmail, req.body.signupUsername, req.body.signupPassword, req, res);
})

// Route for logging in a user
const { loginEmailPassword } = require('./public/scripts/classes/firebase');

app.post('/api/login', function (req, res) {
    loginEmailPassword(req.body.loginEmail, req.body.loginPassword, req, res);
})

const { loginGuest } = require('./public/scripts/classes/firebase');
app.post('/api/guestLogin', function (req, res) {
    loginGuest(req.body.guestUsername, req, res);
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});
