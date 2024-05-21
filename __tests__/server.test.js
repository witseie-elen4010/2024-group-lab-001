// socket.test.js
const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');
const { generatePromptIndex,randomizePlayerOrder,assigningRoles,serverLogic} = require('../socket');
const express = require('express');
const session = require('express-session');
const { count } = require('console');
const exp = require('constants');
//const { default: test } = require('node:test');

let socket;
let clientSockets = [];
let httpServer;
let ioServer;
let rooms = new Map();

beforeAll((done) => {
  const app = express();
  const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  });

  app.use(sessionMiddleware);

  httpServer = http.createServer(app);
  ioServer = ioBack(httpServer);
  ioServer.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  serverLogic(ioServer, new Map(), rooms);
  httpServer.listen(0, () => {
    console.log('Server started on port', httpServer.address().port);
    done();
  });
});

afterAll((done) => {
  ioServer.close(() => {
    httpServer.close(() => {
      done();
    });
  });
});

beforeEach((done) => {
  // Create multiple client-side sockets
  const numSockets = 3; // Adjust the number of sockets as needed
  clientSockets = [];

  socket = io.connect(`http://127.0.0.1:${httpServer.address().port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
    query: { username: 'testUser' }
  });

  for (let i = 0; i < numSockets; i++) {
    const clientSocket = io.connect(`http://127.0.0.1:${httpServer.address().port}`, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
      query: { username: `testUser${i + 1}` }
    });
    clientSockets.push(clientSocket);
  }

  // Wait for all client sockets to connect
  let connectedCount = 0;
  const checkAllConnected = () => {
    connectedCount++;
    if (connectedCount === numSockets + 1) {
      done();
    }
  };

  socket.on('connect', checkAllConnected);
  clientSockets.forEach((clientSocket) => {
    clientSocket.on('connect', checkAllConnected);
  });

  // Error event listeners for debugging
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('connect_timeout', () => {
    console.error('Socket connection timeout');
  });
});

afterEach((done) => {
  // Disconnect all client sockets
  clientSockets.forEach((socket) => {
    socket.disconnect();
    socket.removeAllListeners();
  });

  if (socket.connected) {
    socket.disconnect();
    socket.removeAllListeners();
  }
  done();
});

describe('Socket.IO Tests', () => {
  
  // Test to ensure a user can create a room
  it('should create a room and emit room created event', (done) => {
    socket.on('room created', (data) => {
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);
      expect(data.username).toBe('testUser');
      done();
    });

    socket.emit('create room');
  });

  // Test if users can join a created room 
  it('should handle multiple socket connections to join a game room', (done) => {
    let roomId; 
    socket.emit('create room');

    socket.on('room created', (data) => {
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);
    
      roomId = data.roomId;

      // Connect multiple clients to the room
      clientSockets.forEach((socket) => {
      socket.emit('join room', data.roomId);
    });
    });

    // Wait for all clients to join the room
    let joinedCount = 0;
    clientSockets.forEach((socket) => {
      socket.on('player joined', (data) => {
        expect(data.roomId).toBe(roomId);
        joinedCount++;
        if (joinedCount === clientSockets.length) {
          done();
        }
      });
    });
  });

  // // Test if the users can be returned to the lobby screen after playing a full game and staying in the same lobby 
  it('should return to the lobby screen after a full game and lobby is maintained', (done) => {
    let roomId; 
    socket.on('room created', (data) => {
      roomId = data.roomId;
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);

      socket.emit('return',data.roomId);
    });
    socket.emit('create room');
    socket.on('return-lobby', (data) =>{
      expect(data.roomId).toBe(roomId);
      expect(data.playerCount).toBe(1);
      done();
    });
  });

  // Test if timer event for starting the game is created 
  it('should start the timer to begin countdown for starting a game', (done)=>{
    socket.on('room created', (data) => {
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);
      socket.emit('create-timer'); 
    });
    socket.emit('create room');

    socket.on('create-timer-user', (data) => {
      expect(data.roomId).toBeDefined();
      done();
    });
  });

  // Test to determine if the user can start the game after players have joined the room 
  it('should notify the other players that the game has started', (done)=>{
    let roomId; 
    socket.emit('create room');
    socket.on('room created', (data) => {
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);
      roomId = data.roomId;
      clientSockets.forEach((clientSocket) => {
        clientSocket.emit('join room',data.roomId);
      }); 
    });

    // Wait for all clients to join the room
    let joinedCount = 0;
    clientSockets.forEach((clientsocket) => {
    clientsocket.on('player joined', (data) => {
    expect(data.roomId).toBe(roomId);
    joinedCount++;
    if (joinedCount === clientSockets.length) {
      socket.emit('start-game', roomId);
      }
    });
    });

    socket.on('game-started', (data) => {
      expect(data.remainingUsernames).toBeDefined();
      expect(data.gameState).toBeDefined();
      clientSockets.forEach((clientSocket) => {
        clientSocket.on('game-started', (data) => {
          expect(data.gameState).toBeDefined();
          expect(data.remainingUsernames).toBeDefined();
        })
      });
      done();
    });
  });


  // Test to ensure users are passed the correct roles on the start of the game 
  it("should send users their corresponding roles at the starting of the game", (done)=>{
    let roomId; 
    socket.emit('create room');
    socket.on('room created', (data) => {
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);
      roomId = data.roomId;
      clientSockets.forEach((clientSocket) => {
        clientSocket.emit('join room',data.roomId);
      }); 
    });

    // Wait for all clients to join the room
    let joinedCount = 0;
    clientSockets.forEach((clientsocket) => {
    clientsocket.on('player joined', (data) => {
    expect(data.roomId).toBe(roomId);
    joinedCount++;
    if (joinedCount === clientSockets.length) {
      socket.emit('start-game', roomId);
      }
    });
    });

    players = [socket, clientSockets[0], clientSockets[1], clientSockets[2]];

    players[0].on('game-started', (data)=>{
      expect(data.remainingUsernames).toBeDefined();
      expect(data.gameState).toBeDefined();
      players.forEach((player) => {
        player.on('game-started', (data) => {
          expect(data.gameState).toBeDefined();
          expect(data.remainingUsernames).toBeDefined();
        })
      });
      expect(rooms.get(roomId).turn).toBe(0); 
      expect(rooms.get(roomId).playerOrder).toBeDefined();
      expect(rooms.get(roomId).playerOrder.length).toBe(rooms.get(roomId).roles.length);
      for(let i = 0; i < rooms.get(roomId).roles.length; i++)
      {
        if(i == 0){expect(rooms.get(roomId).roles[i]).toBe("promptEntry");}
        else if(i%2 != 0){expect(rooms.get(roomId).roles[i]).toBe("drawing");}
        else{expect(rooms.get(roomId).roles[i]).toBe("promptEntryToDrawing");}
      }
      done();
    });
  });

  // Test to ensure once player has completed a turn players are redirected
  it('should send the users to the corresponding waiting and playing screens after a players turn', (done)=>{
    let roomId; 
    socket.emit('create room');
    socket.on('room created', (data) => {
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);
      roomId = data.roomId;
      clientSockets.forEach((clientSocket) => {
        clientSocket.emit('join room',data.roomId);
      }); 
    });

    // Wait for all clients to join the room
    let joinedCount = 0;
    clientSockets.forEach((clientsocket) => {
    clientsocket.on('player joined', (data) => {
    expect(data.roomId).toBe(roomId);
    joinedCount++;
    if (joinedCount === clientSockets.length) {
      socket.emit('start-game', roomId);
      }
    });
    });

    players = [socket, clientSockets[0], clientSockets[1], clientSockets[2]];

    players[0].on('game-started', (data)=>{
      expect(data.remainingUsernames).toBeDefined();
      expect(data.gameState).toBeDefined();
      players.forEach((player) => {
        player.on('game-started', (data) => {
          expect(data.gameState).toBeDefined();
          expect(data.remainingUsernames).toBeDefined();
        })
      });
      expect(rooms.get(roomId).turn).toBe(0); 
      expect(rooms.get(roomId).playerOrder).toBeDefined();
      expect(rooms.get(roomId).playerOrder.length).toBe(rooms.get(roomId).roles.length);
      for(let i = 0; i < rooms.get(roomId).roles.length; i++)
      {
        if(i == 0){expect(rooms.get(roomId).roles[i]).toBe("promptEntry");}
        else if(i%2 != 0){expect(rooms.get(roomId).roles[i]).toBe("drawing");}
        else{expect(rooms.get(roomId).roles[i]).toBe("promptEntryToDrawing");}
      }
      players[rooms.get(roomId).playerOrder[0]].emit('gameplay-loop',{prompt:"TestPrompt"}); 

      // Loop and check that each player would have received the correct emit and role 
      let countPlayers = 0; 
      for(let i = 0 ; i < players.length; i++)
      {
        // Expect the rest of the players to be sent to the waiting screen
        if(i!=rooms.get(roomId).turn){  
          players[rooms.get(roomId).playerOrder[i]].on('switch-screen-waiting', (data) => {
          expect(data.gameState).toBe("waiting");
          countPlayers++; 
          if(countPlayers == 3){done()};
        });
        }
        else
        {
          // Expect the next players turn to be drawing after the first round 
          players[rooms.get(roomId).playerOrder[i]].on('gameplay-loop', (data)=>{
            expect(data.gameState).toBe("drawing");
          })
          countPlayers++; 
          if(countPlayers == 3){done()};
        }
      }
 
    });
  });

  // Test to ensure that after the game has completed that after the second player finishes their turn the playing order is maintained
  it('should maintain the playing order after the second player finishes their turn', (done) => {
    let roomId; 
    socket.emit('create room');
    socket.on('room created', (data) => {
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);
      roomId = data.roomId;
      clientSockets.forEach((clientSocket) => {
        clientSocket.emit('join room',data.roomId);
      }); 
    });

    // Wait for all clients to join the room
    let joinedCount = 0;
    clientSockets.forEach((clientsocket) => {
    clientsocket.on('player joined', (data) => {
    expect(data.roomId).toBe(roomId);
    joinedCount++;
    if (joinedCount === clientSockets.length) {
      socket.emit('start-game', roomId);
      }
    });
    });

    players = [socket, clientSockets[0], clientSockets[1], clientSockets[2]];

    players[0].on('game-started', (data)=>{
      expect(data.remainingUsernames).toBeDefined();
      expect(data.gameState).toBeDefined();
      players.forEach((player) => {
        player.on('game-started', (data) => {
          expect(data.gameState).toBeDefined();
          expect(data.remainingUsernames).toBeDefined();
        })
      });
      players[rooms.get(roomId).playerOrder[0]].emit('gameplay-loop',{prompt:"TestPrompt"}); 

      players[rooms.get(roomId).playerOrder[1]].on('gameplay-loop', (data)=>{
        expect(data.gameState).toBe("drawing");
        players[rooms.get(roomId).playerOrder[1]].emit('gameplay-loop',{drawing:"TestDrawing"});

        players[rooms.get(roomId).playerOrder[2]].on('gameplay-loop', (data)=>{
          expect(data.gameState).toBe("promptEntryToDrawing");
          done();
        });
      })
 
    });
  });

  // Test lobby size of three players ends after the third players turn 
  it('should end the game if a lobby size of three players have all played', (done) => {
    let roomId; 
    clientSockets[0].on('room created', (data) => {
          expect(data.roomId).toBeDefined();
          expect(data.playerCount).toBe(1);
          roomId = data.roomId;
          for(let i = 1; i < clientSockets.length; i++) 
          {
            clientSockets[i].emit('join room', roomId);
          }
        });
    
    clientSockets[0].emit('create room');

    let joinedCount = 0;
    for(let i =  1; i < clientSockets.length; i++)
    {
      clientSockets[i].on('player joined', (data) =>{
        expect(data.roomId).toBe(roomId);
        joinedCount++;
        if (joinedCount === clientSockets.length - 1) 
        {
          clientSockets[0].emit('start-game', roomId);
        }
      });
    }

    clientSockets[0].on('game-started', (data) =>{
      expect(data.gameState).toBeDefined();
      clientSockets[rooms.get(roomId).playerOrder[0]].emit('gameplay-loop', {prompt:"TestPrompt"});
      clientSockets[rooms.get(roomId).playerOrder[1]].on('gameplay-loop', (data) => {
        clientSockets[rooms.get(roomId).playerOrder[1]].emit('gameplay-loop', {drawing:"TestDrawing"});
        clientSockets[rooms.get(roomId).playerOrder[2]].on('gameplay-loop', (data) => {
          clientSockets[rooms.get(roomId).playerOrder[2]].emit('gameplay-loop', {prompt:"TestPrompt"});
          let playercount = 0; 
          clientSockets.forEach( (clientSocket) => {
            clientSocket.on('gameplay-loop', (data) => {
              expect(data.gameState).toBe("endgame");
              playercount++;
              if(playercount == 3){done()};
            });
          });
        });
      });
    });
  });

  // Test lobby size of four players ends after the fourth players turn 
  it('should end the game if a lobby size of four players have all played', (done) => {
    let roomId; 
    socket.emit('create room');
    socket.on('room created', (data) => {
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);
      roomId = data.roomId;
      clientSockets.forEach((clientSocket) => {
        clientSocket.emit('join room',data.roomId);
      }); 
    });

    // Wait for all clients to join the room
    let joinedCount = 0;
    clientSockets.forEach((clientsocket) => {
    clientsocket.on('player joined', (data) => {
    expect(data.roomId).toBe(roomId);
    joinedCount++;
    if (joinedCount === clientSockets.length) {
      socket.emit('start-game', roomId);
      }
    });
    });

    players = [socket, clientSockets[0], clientSockets[1], clientSockets[2]];

    players[0].on('game-started', (data)=>{
      expect(data.remainingUsernames).toBeDefined();
      expect(data.gameState).toBeDefined();
      players.forEach((player) => {
        player.on('game-started', (data) => {
          expect(data.gameState).toBeDefined();
          expect(data.remainingUsernames).toBeDefined();
        })
      });
      console.log(rooms.get(roomId));
      players[rooms.get(roomId).playerOrder[0]].emit('gameplay-loop',{prompt:"TestPrompt"}); 

      players[rooms.get(roomId).playerOrder[1]].on('gameplay-loop', (data)=>{
        players[rooms.get(roomId).playerOrder[1]].emit('gameplay-loop',{drawing:"TestDrawing"});

        players[rooms.get(roomId).playerOrder[2]].on('gameplay-loop', (data)=>{
          players[rooms.get(roomId).playerOrder[2]].emit('gameplay-loop',{prompt:"TestPrompt"});

          players[rooms.get(roomId).playerOrder[3]].on('gameplay-loop', (data)=>{
            players[rooms.get(roomId).playerOrder[3]].emit('gameplay-loop',{drawing:"TestDrawing"});

            let playercount = 0; 
            players.forEach( (player) => {
              player.on('gameplay-loop', (data) => {
                expect(data.gameState).toBe("endgame");
                playercount++;
                if(playercount == 4){done()};
              });
            })
          });
        });
      })
    });
  });



  // Test to ensure that user is sent a prompt if they decide not to enter a prompt themself
  it('should provide a user with a prompt if they cannot decide on one', (done) => {
    socket.on('room created', (data) => {
      expect(data.roomId).toBeDefined();
      expect(data.playerCount).toBe(1);
  
      socket.on('random-prompt-generated', (data) => {
        expect(data.prompt).toBeDefined();
        done();
      });
      socket.emit('random-prompt');
    });
  
    socket.emit('create room');
  });

  // Tests to ensure correlating error messages are produced

  // Test to determine if corresponding error is produced if room user is attempting to join cannot be found
  it('should handle joining non-existent room', (done) => {
    socket.emit('join room', 'nonExistentRoom');
    socket.on('Joining Room has Failed', (data) => {
      expect(data.error).toBe('Room not Found!');
      done();
    });
  });

  // // Test to determine if corresponding error is thrown if user tries to return to non-existant lobby
  it('should throw an expected error if attempting to return to non-existant room', (done) => {
    socket.emit('return');
    socket.on('return-lobby failed', (data) => {
      expect(data.error).toBe('Room not found');
      done();
    });
  });


  // Test to determine if incorrect roomId is giving when trying to start a game corresponding error is thrown 
  it('should throw an expected error if attempting to start a game to a non-existant room', (done)=>{
    socket.emit('start-game', "InCorrectRoomId");
    socket.on("game start failed", (data) => {
      expect(data.error).toBe("Room not found")
      done();
    });
  })

  // Test to ensure corresponding error is thrown if incorrect roomId is passed in to timer function 
  it('should throw an expected error if creating a timer in a non-existant roomID', (done)=>{
    socket.emit('create-timer');
    socket.on('timer creation failed', (data) => {
      expect(data.error).toBe("Room not found");
      done();
    });
  });

  // Test to ensure corresponding error is thrown if user sends a prompt to a non-existing room
  it('should throw an expected error if user attempts to send a prompt to a non-existing room', (done)=>{
    socket.emit('gameplay-loop', {prompt: "Test", drawing: "Test"});
    socket.on('prompt entry failed', (data) => {
      expect(data.error).toBe("Room not found");
      done();
    });
  });

  // // Test to ensure user is provided with a prompt if they cannot decide on one 
  it('should throw an expected error if user is attempting to get a prompt from a non-existing room', (done)=>{
    socket.on('random-prompt failed', (data) =>{
      expect(data.error).toBe("Room not found");
      done();
    })
    socket.emit('random-prompt');
  });


});


// Test the generatePromptIndex function
describe('generatePromptIndex function tests', () => {
  it('should return a number between 1 and 30', () => {
    const index = generatePromptIndex();
    expect(index).toBeGreaterThanOrEqual(1);
    expect(index).toBeLessThanOrEqual(30);
  });

  it('should return an integer', () => {
    const index = generatePromptIndex();
    expect(Number.isInteger(index)).toBe(true);
  });
});