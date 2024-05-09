// socket.js

// Import necessary modules and functions
const { getUsername } = require('./public/scripts/classes/firebase');
const { getUserEmail } = require('./public/scripts/classes/firebase');

// Define helper functions
function createCode() {
    let result = '';
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getSessionID(socket) {
    return socket.request?.sessionID || null;
}

// Socket.IO logic
module.exports = (io, userNames, rooms) => {
    io.on('connection', (socket) => {
        console.log(`User: ${socket.id} has now connected to the server.`);
        let sessionID = getSessionID(socket);
        console.log(`Route Session ID: ${sessionID}`);
        
        // Handle 'create room' event
        socket.on('create room', async () => {
            try {
                const roomId = createCode();
                const sessionId = getSessionID(socket);
                const username = await getUsername();
                
                rooms.set(roomId, { players: new Map() }); 
                userNames.set(roomId, new Map());
                rooms.get(roomId).players.set(socket.id, username); 
                socket.roomId = roomId; 
                socket.join(roomId); 

                const remainingUsernames = Array.from(rooms.get(roomId).players.values());
                socket.emit('room created', { roomId, playerCount: rooms.get(roomId).players.size, username, remainingUsernames });
                console.log(`Player with Socket ID: ${socket.id} and Username: ${username}, has created and joined a room.${roomId}`);
            } catch (error) {
                console.error('Error creating room:', error);
                socket.emit('Room Creation Failed', { error: error.message });
            }
        });

        // Handle 'join room' event
        socket.on('join room', async (roomId) => {
            try {
                if (!rooms.has(roomId)) {
                    throw new Error('Room not Found!');
                }

                const room = rooms.get(roomId);
                const username = await getUsername();
                room.players.set(socket.id, username); 

                if (!userNames.has(roomId)) {
                    userNames.set(roomId, new Map());
                }
                userNames.get(roomId).set(socket.id, username);
        
                socket.roomId = roomId; 
                socket.join(roomId); 

                const playerCount = room.players.size;
                const remainingUsernames = Array.from(rooms.get(roomId).players.values());
                io.to(roomId).emit('player joined', { playerId: socket.id, roomId, playerCount, remainingUsernames }); 
                console.log(`Player with Socket ID: ${socket.id} and Username: ${username} has joined Room: ${roomId}`);
            } catch (error) {
                console.error('Error Joining Room:', error);
                socket.emit('Joining Room has Failed', { error: error.message });
            }
        });

        // Handle 'disconnect' event
        socket.on('disconnect', () => {
            const roomId = socket.roomId;
            if (rooms.has(roomId)) {
                const room = rooms.get(roomId);
                room.players.delete(socket.id); 
                const playerCount = room.players.size;

                const username = room.players.get(socket.id);
                if (userNames.has(roomId)) {
                    const usernamesMap = userNames.get(roomId);
                    usernamesMap.delete(socket.id);
        
                    const remainingUsernames = Array.from(rooms.get(roomId).players.values())
                    io.to(roomId).emit('player left', { playerId: socket.id, roomId, playerCount, remainingUsernames }); 
                    console.log(`Player ${socket.id} left room ${roomId}`);
                    console.log(`Remaining users: ${remainingUsernames}`);
                }
            }
        });    

        // Handle 'start-game' event
        socket.on('start-game', (roomId) => {
            try {
                if (!rooms.has(roomId)) {
                    throw new Error('Room not found');
                }

                const room = rooms.get(roomId);
                const playerCount = room.players.size;
                io.to(socket.roomId).emit('game-started',{playerId:socket.id, roomId, playerCount});
                console.log('Game has started in room: '+ roomId);
            } catch (error) {
                console.error('Error starting game:', error);
                socket.emit('game start failed', { error: error.message });
            }
        });

        // Handle 'create-timer' event
        socket.on('create-timer', () => {
            try {
                io.to(socket.roomId).emit('create-timer-user',{roomId:socket.roomId});
                console.log("Timer creation started");
            } catch (error) {
                console.error('Error creating timer:', error);
                socket.emit('timer creation failed', { error: error.message });
            }
        });
    });
};
