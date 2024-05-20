import screenManager from './game.js';

const socket = io();    
const createRoomForm = document.getElementById("createRoomForm");
const joinRoomForm = document.getElementById("joinRoomForm");
const randomPromptButton = document.getElementById("randomPromptButton"); // Button to generate a random prompt for the player
let gameStarted = false; // Flag to track game state

// Buttons for game loop 
const promptEntry = document.getElementById("prompt-button"); // Button for player who is entering the intial prompt
const drawingEntry = document.getElementById("submitDrawingButton"); // Button to submit the players drawing of a giving prompt 
const guessingDrawingEntry = document.getElementById("guess-button"); // Button to submit the prompt obtained from a giving drawing.
const returnLobbySession = document.getElementById("backToLobbySessionButton"); // Button to return to Lobby Screen

createRoomForm.addEventListener("submit", event => {
    event.preventDefault(); // Prevent form submission
    screenManager.setHost();
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

// Button listeners to emit corresponding information back to the server when user has completed their prompt 
promptEntry.addEventListener("click", event =>{
    event.preventDefault();
    socket.emit('gameplay-loop',{prompt:document.getElementById("promptInput").value});
    document.getElementById("promptInput").value = "";
});

// Button listener to emit corresponding information back to the server when user has compelted their drawing from a giving prompt 
drawingEntry.addEventListener("click", event =>{
    event.preventDefault();
    var canvas = document.getElementById('drawing-canvas');
    var data = canvas.toDataURL(); // defaults to PNG
    socket.emit('gameplay-loop',{drawing:data});
});

// Button listener to emit corresponding information back to the server when user has compeleted their prompt from a giving drawing 
guessingDrawingEntry.addEventListener("click", event =>{
    event.preventDefault();
    socket.emit('gameplay-loop',{prompt:document.getElementById('guessInput').value})
    document.getElementById("guessInput").value = "";
});

// Button listener to emit corresponding information back to the server when user wants to return to the lobby screen
returnLobbySession.addEventListener("click", event =>{
    event.preventDefault();
    socket.emit('return');
});

randomPromptButton.addEventListener("click", event => {
    event.preventDefault();
    socket.emit("random-prompt");
    console.log("Random prompt requested");
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
    screenManager.switchLobbyScreen(data.roomId,data.playerCount, data.username, data.remainingUsernames);
});

socket.on("player joined", data => {
    console.log(`Player ${data.playerId} joined the room`);
    console.log(`Player count: ${data.playerCount}`);  
    console.log(`User Logged in: ${data.username}`);  // Check if data.username is received correctly
    // screenManager.switchToLobby(data);
    screenManager.switchLobbyScreen(data.roomId,data.playerCount, data.username, data.remainingUsernames);
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
        screenManager.switchLobbyScreen(data.roomId,data.playerCount, data.username, data.remainingUsernames);
    }
});

socket.on('game-started', (data) => {
    console.log("Game started");
    gameStarted = true;
    screenManager.updateRemainingUsernames(data.remainingUsernames);
    console.log(data)
    screenManager.switchingGameScreen({gameState:data.gameState,numberOfTurns:data.numberOfTurns,
        currentRoundPlayer: data.currentRoundPlayer, currentRoundRole: data.currentRoundRole});
});

socket.on('cannot-start-game', () => {
    console.log("Cannot start the game")
});

socket.on('create-timer-user', data =>{
    console.log("User is receiving timer creation")
    screenManager.createTimer(data.roomId);
});

// Sockets listeneres for when the server sends out the response of the players in the room 

// Socket listener to send the change the screen of the player to a screen provided by data.gameState and required information from data.info 
// containing either data.info.prompt or data.info.drawing 
socket.on('gameplay-loop', data => {
    screenManager.switchingGameScreen({gameState:data.gameState,info:data.info});
});

// For now players will get a waiting screen
socket.on('switch-screen-waiting', data =>{
    screenManager.switchingGameScreen({gameState:data.gameState,numberOfTurns:data.numberOfTurns,
        currentRoundPlayer: data.currentRoundPlayer, currentRoundRole: data.currentRoundRole});
});

socket.on('return-lobby', data =>{
    gameStarted = false;
    console.log("Returning to lobby screen");
    screenManager.switchLobbyScreen(data.roomId,data.playerCount, data.username, data.remainingUsernames);
});

socket.on("random-prompt-generated", data => {
    console.log("Random prompt received: " + data.prompt);

    const promptBox = document.getElementById('promptInput'); 
    // Set the value of the promptBox to the prompt
    promptBox.value = "";
    promptBox.value = data.prompt;
});

export default {
    socket
};
