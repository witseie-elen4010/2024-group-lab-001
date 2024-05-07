import screenManager from './screenManager.js';

const socket = io();    
const createRoomForm = document.getElementById("createRoomForm");
const joinRoomForm = document.getElementById("joinRoomForm");
let gameStarted = false; // Flag to track game state

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
    } else {
        // Switch back to lobby screen if the game hasn't started
        screenManager.switchLobbyScreen(data.roomId,data.playerCount,data.remainingUsernames);
    }
});

socket.on('game-started', () => {
    console.log("Game started");
    gameStarted = true;
    screenManager.switchToDrawingScreen();
});

socket.on('cannot-start-game', () => {
    console.log("Cannot start the game")
});

socket.on('create-timer-user', data =>{
    console.log("User is receiving timer creation")
    screenManager.createTimer(data.roomId);
});

export default {
    socket
};
