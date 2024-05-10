// socket.js

// Import necessary modules and functions
const { assert } = require('console');
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

// Assign the specific role each player during game loop
function assigningRoles(numberPlayers)
{
   let roles = [];
   for(let i = 0; i < numberPlayers; i++)
    {
        if(i == 0)
        {
            roles.push("promptEntry");
        }
        // Odd 
        else if((i+1)%2 != 0)
        {
            roles.push("promptDrawing"); 
        }
        // Even
        else 
        {
            roles.push("drawing");
        }   
    }  
    return roles; 
}

function randomizePlayerOrder(numberPlayers)
{
    let playerOrder = [];
    for(let i = 0; i < numberPlayers; i++)
    {
        playerOrder.push(i);
    }
    // Randomize the indexes stored 
    playerOrder = shuffle(playerOrder);
    return playerOrder;

}

// Randomally shuffle the indexes to randomize order of players 
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Socket.IO logic
module.exports = (io, userNames, rooms) => {

    const GameState = {
        promptEntry: "promptEntry", 
        drawing: "drawing",
        promptGuessing: "promptDrawing",
        WAITING: "waiting"
    }

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
                
                rooms.set(roomId, { players: new Map(), turn: 1 , playerOrder: [] , roles: [], logs: []}); 
                userNames.set(roomId, new Map());
                rooms.get(roomId).players.set(socket.id, username); 
                socket.roomId = roomId; 
                socket.join(roomId); 

                const remainingUsernames = Array.from(rooms.get(roomId).players.values());
                // const remainingUsernames = Array.from(rooms.get(roomId).players.values()).filter(name => name !== username);
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
                // username (role)
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
                const remainingUsernames = Array.from(rooms.get(roomId).players.values());

                // Send events to each player to begin the game 
                let players = Array.from(room.players.keys())
                console.log(players)
                room.playerOrder = randomizePlayerOrder(playerCount); 
                room.roles = assigningRoles(playerCount);
                room.turn = 1; 
                console.log(room.roles)
                console.log(room.playerOrder)
                for(let i = 0; i < players.length; i++) {
                    if(i == 0)
                    {
                    io.to(players[room.playerOrder[i]]).emit("game-started",{gameState:room.roles[i],remainingUsernames:remainingUsernames})
                    }
                    else
                    {
                    io.to(players[room.playerOrder[i]]).emit("game-started",{gameState:GameState.WAITING,remainingUsernames:remainingUsernames})
                    }
                }
                
                //io.to(socket.roomId).emit('game-started',{playerId:socket.id, roomId, playerCount, remainingUsernames});
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

        // Events to handle the responses from the player for the gameplay loop 
        // Need to make an adjustment here so that we store the data of the users prompt and switch to corresponding 
        //Screen 
        // Event for when players responds by sending a drawing prompt 
        socket.on('gameplay-loop', (data) => {
            try {
                if(rooms.has(socket.roomId))
                {
                    if(rooms.get(socket.roomId).turn < rooms.get(socket.roomId).players.size)
                    {
                    let userprompt = data; 
                    if(data.prompt)
                    {console.log("Player with Socket ID: "+ socket.id + " prompt: " + data.prompt);}
                    else if(data.drawing)
                    {console.log("Player with Socket ID: "+ socket.id + " drawing: " + data.drawing);}
                    let room = rooms.get(socket.roomId);
                    let players = Array.from(room.players.keys());

                    // Emit to the specific players turn that he needs to go to the next screen set rest of the players to waiting
                    io.to(players[room.playerOrder[room.turn]]).emit("gameplay-loop",{gameState:room.roles[room.turn],info:userprompt});

                    for(let i = 0; i < players.length; i++)
                    {
                        if(i != room.turn)
                        {
                            console.log(players[i] + " Going to waiting screen");
                            io.to(players[room.playerOrder[i]]).emit("switch-screen-waiting",{gameState:GameState.WAITING});
                        }
                    }
                    room.turn = room.turn + 1; 
                    }
                    else
                    {
                        if(data.prompt)
                            {console.log("Player with Socket ID: "+ socket.id + " prompt: " + data.prompt);}
                            else if(data.drawing)
                            {console.log("Player with Socket ID: "+ socket.id + " drawing: " + data.drawing);}
                        console.log("Eng of the Game :" + socket.roomId);
                        io.to(socket.roomId).emit("gameplay-loop",{gameState:"endgame"});
                    }
                }
                else
                {
                    throw new Error('Room not found');
                }
            } catch (error) {
                console.error('Error handling prompt entry:', error);
                socket.emit('prompt entry failed', { error: error.message });
            }
        });
    });
};
