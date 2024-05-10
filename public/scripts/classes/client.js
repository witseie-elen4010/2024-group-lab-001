import screenManager from './game.js';

const socket = io();    
const createRoomForm = document.getElementById("createRoomForm");
const joinRoomForm = document.getElementById("joinRoomForm");
let gameStarted = false; // Flag to track game state

// Buttons for game loop 
const promptEntry = document.getElementById("prompt-button");
const drawingEntry = document.getElementById("submitDrawing");
const guessingDrawingEntry = document.getElementById("guess-button");

createRoomForm.addEventListener("submit", event => {
    event.preventDefault(); // Prevent form submission
    socket.emit("create room");
});

joinRoomForm.addEventListener("submit", event => {
    event.preventDefault(); // Prevent form submission
    const roomId = roomIdInput.value.trim(); // Get entered room ID
    if (roomId) {
        socket.emit('join room', roomId); // Emit 'join room' event with room ID to the server
        roomIdInput.value = ''; // Clear input field
    }
});

// Button listeners to emit corresponding information back to the server 
promptEntry.addEventListener("click", event =>{
    event.preventDefault();
    socket.emit('gameplay-loop',{prompt:document.getElementById("prompt-input").value});
});

// Button listener to emit corresponding information back to the server 
drawingEntry.addEventListener("click", event =>{
    event.preventDefault();
    var canvas = document.getElementById('drawing-canvas');
    var data = canvas.toDataURL(); // defaults to PNG
    socket.emit('gameplay-loop',{drawing:data});
});

// Button listener to emit corresponding information back to the server
guessingDrawingEntry.addEventListener("click", event =>{
    event.preventDefault();
    socket.emit('gameplay-loop',{prompt:document.getElementById('guess-input').value})
});

// Handle events or further logic here
socket.on("connect", () => {
    console.log(`Connected to server:  ${socket.id}`);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("room created", data => {
    console.log(`Room created with ID: ${data.roomId}`);
    console.log(`Player count: ${data.playerCount}`);
    console.log(`User Logged in: ${data.username}`);
    screenManager.switchLobbyScreen(data.roomId,data.playerCount,data.remainingUsernames);
});

socket.on("player joined", data => {
    console.log(`Player ${data.playerId} joined the room`);
    console.log(`Player count: ${data.playerCount}`);  
    screenManager.switchLobbyScreen(data.roomId,data.playerCount,data.remainingUsernames);
});

socket.on("room not found", () => {
    console.log("Room not found");
});

socket.on("player left", data => {
    console.log(`Player ${data.playerId} left the room`);
    console.log(`Player count: ${data.playerCount}`);
    // Updates Screen when a user disconnects by removing their username.
    if (gameStarted) {
        // Handle disconnection during game
        // For example, display a message to the user indicating the disconnection
        screenManager.updateRemainingUsernames(data.remainingUsernames);
    } else {
        // Switch back to lobby screen if the game hasn't started
        screenManager.switchLobbyScreen(data.roomId,data.playerCount,data.remainingUsernames);
    }
});

socket.on('game-started', (data) => {
    console.log("Game started");
    gameStarted = true;
    screenManager.updateRemainingUsernames(data.remainingUsernames);
    screenManager.switchingGameScreen({gameState:data.gameState});
});

socket.on('cannot-start-game', () => {
    console.log("Cannot start the game")
});

socket.on('create-timer-user', data =>{
    console.log("User is receiving timer creation")
    screenManager.createTimer(data.roomId);
});

// Sockets listeneres for when the server sends out the response of the players in the room 
socket.on('gameplay-loop', data => {
    screenManager.switchingGameScreen({gameState:data.gameState,info:data.info});
});

// For now players will get a waiting screen
socket.on('switch-screen-waiting', data =>{
    screenManager.switchingGameScreen({gameState:data.gameState});
});


export default {
    socket
};
