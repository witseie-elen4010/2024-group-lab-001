import client from './client.js';
let isHost = false; 

function switchLobbyScreen(roomId, playerCount, remainingUsernames) {
    // Hide the lobby container and display the post lobby creation screen
    const lobbyContainer = document.getElementById('lobbyContainer');
    const postLobbyCreationScreen = document.getElementById('postLobbyCreationScreen');
    lobbyContainer.style.display = 'none';
    postLobbyCreationScreen.style.display = 'flex'; // Make the container a flexbox
    postLobbyCreationScreen.className = "container lobby-container";

    // Clear the contents of postLobbyCreationScreen
    postLobbyCreationScreen.innerHTML = '';

    // Left div for lobby code and buttons
    const leftDiv = document.createElement('div');
    leftDiv.className = 'lobby-left';

    // Create a paragraph element to display the room code
    const roomCode = document.createElement('p');
    roomCode.className = "room-code-container";
    roomCode.textContent = `Room Code: ${roomId}`;
    leftDiv.appendChild(roomCode);

    // Create a button element to copy the room code
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = "button copy-button";
    copyToClipboard(copyButton,roomId);
    leftDiv.appendChild(copyButton);

    // Create a button element to start the game
    const startgameButton = document.createElement('button');
    startgameButton.className = 'button start-button';
    startgameButton.id = 'startgame-button';
    startgameButton.disabled = true;
    startgameButton.textContent = 'Start Game';
    startGame(startgameButton,playerCount,roomId);
    leftDiv.appendChild(startgameButton);

    // Right div for displaying usernames
    const rightDiv = document.createElement('div');
    rightDiv.className = 'lobby-right';

    // Create a paragraph element to display the remaining usernames
    const usernameDisplay = document.createElement('p');
    usernameDisplay.className = "room-code-container";
    usernameDisplay.textContent = `Players:`;
    remainingUsernames.forEach(username => {
        const usernameElement = document.createElement('p');
        usernameElement.textContent = username;
        usernameDisplay.appendChild(usernameElement);
    });
    rightDiv.appendChild(usernameDisplay);

    // Append left and right divs to the lobby display element
    postLobbyCreationScreen.appendChild(leftDiv);
    postLobbyCreationScreen.appendChild(rightDiv);
}

function startGame(startgameButton,playerCount,roomId){
    if(playerCount<3){return};
    startgameButton.className = 'button lobby-button';
    startgameButton.disabled = false;
    startgameButton.addEventListener('click', () => {
      isHost = true; 
      client.socket.emit("create-timer");
    });
};

function createTimer(roomId){
  // Right div for displaying usernames
  const rightDiv = document.createElement('div');
  rightDiv.className = 'lobby-right';
  const postLobbyCreationScreen = document.getElementById('postLobbyCreationScreen');

  // Paragraph for "Starting Game In"
  const startingText = document.createElement('p');
  startingText.innerText = "Starting Game In";
  rightDiv.appendChild(startingText); // Add startingText to rightDiv

  // Paragraph for countdown
  const counter = document.createElement('p');
  counter.className = 'lobby-right'; 
  rightDiv.appendChild(counter); // Add counter to rightDiv

  postLobbyCreationScreen.appendChild(rightDiv); // Add rightDiv to postLobbyCreationScreen

  updateTimer(counter,roomId);
}

function updateTimer(counter,roomId){
  // Start countdown
let countdown = 10; // Set countdown time in seconds
const countdownInterval = setInterval(() => {
    counter.innerText = countdown + " seconds"; // Update counter text with countdown
    countdown--;

    if (countdown < 0 && isHost) {
        counter.innerText = "Game started"; // Update counter text when game starts
        console.log("Emitting start game");
        client.socket.emit('start-game', roomId);
        clearInterval(countdownInterval);
        console.log("Game started");
    }
  }, 1000);
}

function copyToClipboard(copyButton, roomId) {
    copyButton.addEventListener('click', function() {
        //  Create a temporary input element
        const tempInput = document.createElement('input');

        // Copy the text content of roomData paragraph
        tempInput.value = roomId; 

        // Append the temporary input element to the body
        document.body.appendChild(tempInput);
        tempInput.select();

        // Execure the copy command to copy the text to clipboard
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        copyButton.textContent = 'Copied!';
        setTimeout(function() {
            copyButton.textContent = 'Copy';
        }, 2000); // Reset button text after 2 seconds
    });
}

function switchToDrawingScreen()
{
    console.log("Function being called");
    document.getElementById('postLobbyCreationScreen').style.display = 'none'; 
    fetch('/draw')
        .then(response => response.text())
        .then(data => {
            document.getElementById('drawingScreen').innerHTML = data;
            const script = document.createElement('script');
            script.src = '/scripts/classes/draw.js'; // Replace with the path to your script file

            // Append the script element to the body or head
            document.body.appendChild(script);
        })
        .catch(error => console.error(error));
}

export default {
    switchLobbyScreen,
    switchToDrawingScreen,
    createTimer
};

