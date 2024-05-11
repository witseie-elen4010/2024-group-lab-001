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
        // First player will always have to enter a prompt to begin drawing sequency 
        if(i == 0)
        {
            roles.push("promptEntry");
        }
        // Odd numbered turn is always providing a prompt for a provided drawing 
        else if((i+1)%2 != 0)
        {
            roles.push("promptEntryToDrawing"); 
        }
        // Even numbered turn is always a user drawing for a provided prompt 
        else 
        {
            roles.push("drawing");
        }   
    }  
    return roles; 
}

// Randomize the order of players by randomizing the index positions of each player 
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
        promptGuessing: "promptEntryToDrawing",
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
                
                rooms.set(roomId, { players: new Map(), turn: 0 , playerOrder: [] , roles: [], logs: []}); 
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

                // There are three cases for when a player disconnects during the game play loop 

                // The player has already played and they decide to leave 

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

                // Convert players to an array. Map stores sequential order of when added to the map so array would be in a sequential order of when user joined the room.
                // Starting with user that created the room.
                let players = Array.from(room.players.keys()) 
                console.log(players)

                // Randomize the order of the players and assign roles to each player
                room.playerOrder = randomizePlayerOrder(playerCount); 
                room.roles = assigningRoles(playerCount);
                room.turn = 0; 
                console.log(room.roles)
                console.log(room.playerOrder)

                // Emit to the first player that their role 
                io.to(players[room.playerOrder[room.turn]]).emit("game-started",{gameState:room.roles[room.turn],remainingUsernames:remainingUsernames});

                // Loop through all players and provide the required intial emits to switch specific players to their corresponding screens 
                for(let i = 0; i < players.length; i++) {
                    if(i != room.turn)
                    {
                    // Rest of the players are assinged the waiting screen as it is not their turn. 
                    io.to(players[room.playerOrder[i]]).emit("game-started",{gameState:GameState.WAITING,remainingUsernames:remainingUsernames});
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
        // Event for when players responds by sending a drawing prompt back or sending a drawing from a giving prompt 
        socket.on('gameplay-loop', (data) => {
            try {
                // Ensure the room exists 
                if(rooms.has(socket.roomId))
                {
                    let room = rooms.get(socket.roomId);

                    // Checking to ensure the number of turns have not been exceeded meaning all players have not played yet
                    if(room.turn < room.players.size - 1)
                    {
                    // Increase room.turn as a player has completed their task and we need to move to the next player 
                    room.turn = room.turn + 1; 

                    // Data provided can either be data.prompt or data.drawing based on the emit from the clients visible screen
                    let userprompt = data; 

                    let players = Array.from(room.players.keys()); // Getting the players socket.ids within a specific room in sequential order of who entererd the room first.

                    // Display the specific socket.id and data being returned by the user finally the time stamp of when data was received. 
                    if(data.prompt){
                        console.log("Player with Socket ID: "+ socket.id + " prompt: " + data.prompt + " Received prompt at: " + new Date().toISOString());
                        //room.logs.push(new LogEntry(socket.id,"prompt",data.prompt));
                    }
                    else if(data.drawing){
                        console.log("Player with Socket ID: "+ socket.id + " drawing: " + data.drawing + " Received drawing at: " + new Date().toISOString());
                        //room.logs.push(new LogEntry(socket.id,"drawing",data.drawing));
                    }
                    
                    // Emit to the specific players turn that they need to go to the next screen and set rest of the players to waiting
                    io.to(players[room.playerOrder[room.turn]]).emit("gameplay-loop",{gameState:room.roles[room.turn],info:userprompt});

                    // Loop through the rest of players and set them to waiting as it is not their turn 
                    for(let i = 0; i < players.length; i++)
                    {
                        if(i != room.turn)
                        {
                            console.log(players[i] + " Going to waiting screen");
                            io.to(players[room.playerOrder[i]]).emit("switch-screen-waiting",{gameState:GameState.WAITING});
                        }
                    }
                    }
                    else
                    {
                        // Logging final users data that was received when odd players will be a data.prompt but when even users will be data.drawing 
                        if(data.prompt){
                            console.log("Player with Socket ID: "+ socket.id + " prompt: " + data.prompt + " Received prompt at: " + new Date().toISOString());
                            //room.logs.push(new LogEntry(socket.id,"prompt",data.prompt)); 
                        }
                        else if(data.drawing){
                            console.log("Player with Socket ID: "+ socket.id + " drawing: " + data.drawing + " Received prompt at: " + new Date().toISOString());
                            //room.logs.push(new LogEntry(socket.id,"drawing",data.drawing));
                        }
                        console.log("Eng of the Game :" + socket.roomId);

                        // Emit to the entire room that the game has ended can add functionality to this by passing in all the data for the prompts and drawing to display
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
