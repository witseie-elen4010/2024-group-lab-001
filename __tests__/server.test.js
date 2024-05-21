
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

  // Tests to ensure correlating error messages are produced

  // Test to determine if corresponding error is produced if room user is attempting to join cannot be found
  it('should handle joining non-existent room', (done) => {
    socket.emit('join room', 'nonExistentRoom');
    socket.on('Joining Room has Failed', (data) => {
      expect(data.error).toBe('Room not Found!');
      done();
    });
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