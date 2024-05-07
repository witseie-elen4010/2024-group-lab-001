const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const rooms = new Map(); // Map to store active rooms

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
const {createNewAccount} = require('./public/scripts/classes/firebase');

app.post('/api/signup', function (req, res) {
    createNewAccount(req.body.signupEmail, req.body.signupUsername, req.body.signupPassword, req, res);
})

// Route for logging in a user
const {loginEmailPassword} = require('./public/scripts/classes/firebase');

app.post('/api/login', function (req, res) {
    loginEmailPassword(req.body.loginEmail, req.body.loginPassword, req, res);
})

const {loginGuest} = require('./public/scripts/classes/firebase');
app.post('/api/guestLogin', function (req, res) {
    loginGuest(req.body.guestUsername, req, res);
})

function createCode() {
    let result = '';
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const {getUsername} = require('./public/scripts/classes/firebase');
const {getUserEmail} = require('./public/scripts/classes/firebase');

// Socket.IO logic
const userNames = new Map(); // Map to store usernames associated with socket IDs

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('create room', () => {
        // Inside the event handler, define an async function to use await
        async function handleCreateRoom() {
            // Generate a unique room ID
            const roomId = createCode(); 

            // Get the username asynchronously
            const username = await getUsername();
            
            // Create a new room with the generated ID and initialize player count to 0
            rooms.set(roomId, { players: new Map() }); 
            
            // Associate the room ID with a map containing username-socket ID pairs
            userNames.set(roomId, new Map());

            // Add player to room
            rooms.get(roomId).players.set(socket.id, username); 
            
            // Add the room ID to the socket object
            socket.roomId = roomId; 
            socket.join(roomId); 

            // Get remaining usernames from the userNames map
            const remainingUsernames = Array.from(rooms.get(roomId).players.values())

            // Emit 'room created' event with room ID and player count to the client
            socket.emit('room created', { roomId, playerCount: rooms.get(roomId).players.size, username, remainingUsernames});
            console.log(`Player ${socket.id} created and joined room ${roomId}`);
            console.log(`Username: ${username}`);
        }
    
        // Call the async function to handle room creation
        handleCreateRoom();
    });
    

    socket.on('join room', roomId => {
        async function handleJoinRoom() {
            if (rooms.has(roomId)) {
                const room = rooms.get(roomId);
                
                // Generate a unique username for the user
                const username = await getUsername();
            
                // Add player to room
                room.players.set(socket.id, username); 
    
                // Associate the room ID with a map containing username-socket ID pairs
                if (!userNames.has(roomId)) {
                    userNames.set(roomId, new Map());
                }
                userNames.get(roomId).set(socket.id, username);
        
                // Add the room ID to the socket object
                socket.roomId = roomId; 
                socket.join(roomId); 
                const playerCount = room.players.size;
        
                // Get remaining usernames from the userNames map
                const remainingUsernames = Array.from(rooms.get(roomId).players.values())
        
                // Emit 'player joined' event with player ID, room ID, player count, username, and remaining usernames to all clients in the room
                io.to(roomId).emit('player joined', { playerId: socket.id, roomId, playerCount, remainingUsernames }); 
                console.log(`Player ${socket.id} joined room ${roomId}`);
            } 
            else {
                socket.emit('room not found');
            }
        }

         // Call the async function to handle joining a room
         handleJoinRoom();
    });
    
    socket.on('disconnect', () => {
        const roomId = socket.roomId;
        if (rooms.has(roomId)) {
            const room = rooms.get(roomId);
    
            // Remove player from room and adjust the player count
            room.players.delete(socket.id); 
            const playerCount = room.players.size;
    
            // Get the username associated with the disconnected socket ID
            const username = room.players.get(socket.id);
    
            // Remove the username from the map associated with the room ID
            if (userNames.has(roomId)) {
                const usernamesMap = userNames.get(roomId);
                usernamesMap.delete(socket.id);
    
                // Get remaining usernames
                const remainingUsernames = Array.from(rooms.get(roomId).players.values())
    
                // Emit 'player left' event with player ID, room ID, player count, username, and remaining players to all clients in the room
                io.to(roomId).emit('player left', { playerId: socket.id, roomId, playerCount, remainingUsernames }); 
                console.log(`Player ${socket.id} left room ${roomId}`);
                console.log(`Remainding users are: ${remainingUsernames}`);
            }
        }
    });    

    socket.on('start-game', roomId => {
        if (rooms.has(roomId)) {
            const room = rooms.get(roomId);
            const playerCount = room.players.size;
            io.to(socket.roomId).emit('game-started',{playerId:socket.id, roomId,playerCount});
            console.log('Game has started in room: '+ roomId);
          } 
          else {
            socket.emit('cannot-start-game');
          }    
    });

    socket.on('create-timer', ()=>{
        console.log("Timer creation starting");
        io.to(socket.roomId).emit('create-timer-user',{roomId:socket.roomId});
    })
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});

// The createCode function was used obtained from: https://www.programiz.com/javascript/examples/generate-random-strings