const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

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

// Socket.IO logic
io.on('connection', (socket) => {

    console.log(`A user connected: ${socket.id}`);

    socket.on('create room', () => {
        // Generate a unique room ID
        const roomId = generateRoomId(); 

        // Create a new room with the generated ID and initialize player count to 0
        rooms.set(roomId, { players: new Map() }); 

        // Add the room ID to the socket object
        socket.roomId = roomId; 
        const room = rooms.get(roomId);
        
        // Add player to room
        room.players.set(socket.id, true); 
        socket.join(roomId); 

        // Emit 'room created' event with room ID and player count to the client
        socket.emit('room created', { roomId, playerCount: room.players.size });
        console.log(`Player ${socket.id} created and joined room ${roomId}`);
    });

    socket.on('join room', roomId => {
        if (rooms.has(roomId)) {
          const room = rooms.get(roomId);

          // Add player to room
          room.players.set(socket.id, true); 

          // Add the room ID to the socket object
          socket.roomId = roomId; 
          socket.join(roomId); 
          const playerCount = room.players.size;

          // Emit 'player joined' event with player ID, room ID, and player count to all clients in the room
          io.to(roomId).emit('player joined', { playerId: socket.id, roomId, playerCount}); 
          console.log(`Player ${socket.id} joined room ${roomId}`);
        } 
        else {
          socket.emit('room not found');
        }
    });
    
    socket.on('disconnect', ( )=> {
        const roomId = socket.roomId;
        if (rooms.has(roomId)) {
            const room = rooms.get(roomId);

            // Remove player from room and adjust the player count
            room.players.delete(socket.id); 
            const playerCount = room.players.size;

            // Emit 'player left' event with player ID, room ID, and player count to all clients in the room
            io.to(roomId).emit('player left', { playerId: socket.id, roomId, playerCount}); 
            console.log(`Player ${socket.id} left room ${roomId}`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});

function generateRoomId() {
    // Generate a random room ID 
    return Math.random().toString(36).substring(2, 10);
}

