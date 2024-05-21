// game.js

// Module Imports
import client from './client.js';

// Variables
let isHost = false;
let drawingSubmitted = false; 
let countdown = 5; // Countdown timer for game start
let drawingCountdown = 60; // Set countdown time in seconds

function setHost()
{
    isHost = true; 
}

function createPromptElement(promptText, containerId) {
    // Get the container
    const container = document.getElementById(containerId);

    // Create a new <p> element
    const promptElement = document.createElement('p');

    // Set the class of the <p> element
    promptElement.className = 'player-prompt-heading';

    // Set the text of the <p> element
    promptElement.textContent = promptText;

    // Append the <p> element to the container
    container.appendChild(promptElement);
}

function updateRemainingUsernames(currentUsername, remainingUsernames) {
    const drawPlayerContainer = document.getElementById('usernameDisplayOnDraw');
    drawPlayerContainer.innerHTML = '';
    
    // Create a paragraph element to display the remaining usernames
    const usernameHeading = document.createElement('p');
    usernameHeading.className = "title room-code-heading";
    usernameHeading.textContent = `Players`;
    drawPlayerContainer.appendChild(usernameHeading);
    
    // Display the current user's username separately
    if (currentUsername !== '') {
        const currentUsernameButton = document.createElement('button');
        currentUsernameButton.textContent = currentUsername;
        currentUsernameButton.className = "room-code-button username-button";
        drawPlayerContainer.appendChild(currentUsernameButton);
    }
    
    // Loop through each username in remainingUsernames array
    remainingUsernames.forEach(username => {
        // Create a button element for each username
        const usernameButton = document.createElement('button');
        usernameButton.textContent = username;
        usernameButton.className = "room-code-button";
        
        // Append the username button to the centerDiv
        drawPlayerContainer.appendChild(usernameButton);
    });
}

function switchLobbyScreen(roomId, playerCount, currentUsername, remainingUsernames) {
    // Hide the End Game Screen if it is displayed
    document.getElementById('endGameScreen').style.display = 'none';

    // Hide the lobby container and display the post lobby creation screen
    const lobbyContainer = document.getElementById('lobbyContainer');
    const postLobbyCreationScreen = document.getElementById('postLobbyCreationScreen');
    lobbyContainer.style.display = 'none';
    postLobbyCreationScreen.style.display = 'flex'; // Make the container a flexbox
    postLobbyCreationScreen.className = "container lobby-container";

    // Clear the contents of postLobbyCreationScreen
    postLobbyCreationScreen.innerHTML = '';

    // horizontal div for the lobby code and players
    const horizontalDiv = document.createElement('div');
    horizontalDiv.className = 'horizontal-container';
    postLobbyCreationScreen.appendChild(horizontalDiv);

    // Left div for lobby code and buttons
    const leftDiv = document.createElement('div');
    leftDiv.className = 'lobby-left';

    // Create a paragraph element to display the room code
    const roomCodeHeading = document.createElement('p');
    roomCodeHeading.className = "title room-code-heading";
    roomCodeHeading.textContent = `Room Code`; // ${roomId}
    leftDiv.appendChild(roomCodeHeading);

    // Create a button element to display the room code
    const roomCode = document.createElement('button');
    roomCode.textContent = `${roomId}`;
    roomCode.className = "room-code-button";
    leftDiv.appendChild(roomCode);

    // Create a button element to copy the room code
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = "button copy-button";
    copyToClipboard(copyButton,roomId);
    leftDiv.appendChild(copyButton);

    if(isHost){
    // Create a button element to start the game
    const startgameButton = document.createElement('button');
    startgameButton.className = 'button start-button';
    startgameButton.id = 'startgame-button';
    startgameButton.disabled = false;
    startgameButton.textContent = 'Start Game';
    startGame(startgameButton,playerCount,roomId);
    leftDiv.appendChild(startgameButton);
    }

    // Right div for displaying usernames
    const centerDiv = document.createElement('div');
    centerDiv.id = 'centerDiv';
    centerDiv.className = 'lobby-right';

    // Create a paragraph element to display the remaining usernames
    const usernameHeading = document.createElement('p');
    usernameHeading.className = "title room-code-heading";
    usernameHeading.textContent = `Players`;
    centerDiv.appendChild(usernameHeading);
    
    // Display the current user's username separately
    const currentUsernameButton = document.createElement('button');
    currentUsernameButton.textContent = currentUsername;
    currentUsernameButton.className = "room-code-button username-button";
    centerDiv.appendChild(currentUsernameButton);

    // Loop through each username in remainingUsernames array
    remainingUsernames.forEach(username => {
        // Create a button element for each username
        const usernameButton = document.createElement('button');
        usernameButton.textContent = username;
        usernameButton.className = "room-code-button";
        
        // Append the username button to the centerDiv
        centerDiv.appendChild(usernameButton);
    });

    // Create a 'Leave Lobby' button
    const leaveLobbyButton = document.createElement('button');
    leaveLobbyButton.textContent = 'Leave Lobby';
    leaveLobbyButton.className = "room-code-button red-button";

    // Add an onclick event listener to refresh the page
    leaveLobbyButton.onclick = function() {
        window.location.reload();
    };

    // Append the 'Leave Lobby' button to the centerDiv
    centerDiv.appendChild(leaveLobbyButton);

    // Append left and right divs to the lobby display element
    horizontalDiv.appendChild(leftDiv);
    horizontalDiv.appendChild(centerDiv);
}

function startGame(startgameButton, playerCount, roomId) {
    if (playerCount == 3 || playerCount == 4 || playerCount == 5) {
        // startgameButton.disabled = false;
        startgameButton.className = 'button lobby-button';
    }

    startgameButton.addEventListener('click', () => {
        if (playerCount < 3 || playerCount > 5) {
            alert('Player count must be between 3 and 5.');
            return;
        } else if (isHost) {
            client.socket.emit("create-timer");
        } else if (!isHost) {
            alert('Only the host can start the game.');
        }
    });
}

function createTimer (roomId) {
    // Right div for displaying usernames
    const timerDiv = document.createElement('div')
    timerDiv.className = '.lobby-right'
    const postLobbyCreationScreen = document.getElementById('postLobbyCreationScreen')

    // Paragraph for "Starting Game In"
    const startingText = document.createElement('p')
    startingText.className = 'lobby-container-text start-time-container start-time-text'
    startingText.innerText = 'Game Starting In:'
    timerDiv.appendChild(startingText) // Add startingText to rightDiv

    // Paragraph for countdown
    const counter = document.createElement('p')
    counter.className = 'room-code-container start-time-container'
    counter.id = 'countdownForStarting';
    timerDiv.appendChild(counter) // Add counter to rightDiv

    postLobbyCreationScreen.appendChild(timerDiv) // Add rightDiv to postLobbyCreationScreen
    countdown = 5; // Reset the countdown timer
    updateTimer(counter, roomId)
}

function updateTimer(counter,roomId){
    const countdownInterval = setInterval(() => {
        counter.innerText = countdown + " seconds"; // Update counter text with countdown
        countdown--;

        if (countdown < 0) {
            counter.innerText = "Game started"; // Update counter text when game starts
            console.log("Emitting start game");
            if(isHost){
                client.socket.emit('start-game', roomId);
            }
            clearInterval(countdownInterval);
            console.log("Game: A Game session has started.");
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

// Function to switch between different screens. screens specified by data.gameState and the 
// additional information can be passeed in through data.info either being data.info.prompt or data.info.drawing
// This is the only function that is exported and allows access to other functions if corresponding data.gameState and data.info is passed into the function
function switchingGameScreen(data)
{
    if(data.gameState == 'promptEntry')
    {
        switchToPromptEntryScreen();
    }
    else if(data.gameState == 'drawing')
    {
        switchToDrawingScreen({prompt:data.info.prompt});
    }
    else if(data.gameState == 'promptEntryToDrawing')
    {
        switchToGuessingScreen({drawing:data.info.drawing});
    }
    else if(data.gameState == 'waiting')
    {
        switchToWaitingScreen({numberOfTurns:data.numberOfTurns, currentRoundPlayer:data.currentRoundPlayer, 
            currentRoundRole:data.currentRoundRole});
    }
    else{
        endGame({drawingPrompts:data.info, playerUsername:data.passedUsername});
    }
}

function blockAutoButtonPresses(){
    promptSubmitted = true;
    drawingSubmitted = true;
}
function resetTimers(){
    resetGuessTimer();
    resetPromptTimer();
    resetDrawingTimer
    console.log("Timers have been reset");
}

function resetPromptTimer(){
    promptCountdown = 30;
    console.log("Prompt Timer has been reset");
    promptSubmitted = false;
}

function resetGuessTimer(){
    guessCountdown = 30;
    console.log("Guess Timer has been reset");
    guessSubmitted = false;
}
// Switch to the waiting screen by setting the divs for other screens to none except for waiting screen
function switchToWaitingScreen(data){
    document.getElementById('postLobbyCreationScreen').style.display = 'none'; 
    document.getElementById('entireDrawingScreen').style.display = 'none';
    document.getElementById("intialPromptScreen").style.display = 'none'; 
    document.getElementById("guessingScreen").style.display = 'none'; 
    document.getElementById("waitingScreen").style.display = 'flex'; //Show the waiting screen
    document.getElementById("turnIndicatorMessage").innerHTML = data.numberOfTurns;
    displayCurrentRoundMessage(data);
    blockAutoButtonPresses();
}

function displayCurrentRoundMessage(data){
    document.getElementById("currentRoundMessage").innerHTML = "";

    switch(data.currentRoundRole) {
        case 'promptEntry':
            document.getElementById("currentRoundMessage").innerHTML =  `${data.currentRoundPlayer} is prompting.` ;
            break;
        case 'promptEntryToDrawing':
            document.getElementById("currentRoundMessage").innerHTML = `${data.currentRoundPlayer} is describing a drawing.` ;
            break;
        case 'drawing':
            document.getElementById("currentRoundMessage").innerHTML = `${data.currentRoundPlayer} is drawing.` ;
            break;
        default:
            break;
    }
}

// Switch to the screen that the player will enter a prompt based on a provided drawing from data.drawing drawn in an image from canvas data

let guessCountdown = 30;
let guessSubmitted = false;

function switchToGuessingScreen(data){
    document.getElementById('postLobbyCreationScreen').style.display = 'none'; 
    document.getElementById('entireDrawingScreen').style.display = 'none';
    document.getElementById("intialPromptScreen").style.display = 'none'; 
    document.getElementById("waitingScreen").style.display = 'none'; 
    document.getElementById("guessingScreen").style.display = 'flex'; //Show the prompt entering screen

    blockAutoButtonPresses();
    resetGuessTimer();
    let guessCounter = document.getElementById("guessCountdownTimer");
    let guessSubmitButton = document.getElementById("guess-button");
    // Timer to end the session of prompting
    const guessCountdownInterval = setInterval(() => {
        guessCounter.innerText = guessCountdown + " seconds"; // Update counter text with countdown
        guessCountdown--;

        guessSubmitButton.addEventListener('click', function() {
            guessSubmitted = true;
            clearInterval(guessCountdownInterval);
        });

        if (guessCountdown < 0 && guessSubmitted == false) {
            guessCounter.innerText = "Guessing Time is Up"; // Update counter text when time is up
            console.log("Guessing is finished");
            clearInterval(guessCountdownInterval);
            guessSubmitButton.click();
        }
    }, 1000);

    const imageContainer = document.getElementById('canvas-data');
    imageContainer.innerHTML = ""; // Clear the contents of the html 
    // Create a new image object
    var img = new Image();

    // When the image loads, create a new canvas and draw the image onto it
    img.onload = function() {
        // Create a new canvas
        var newCanvas = document.createElement('canvas');
        newCanvas.width = img.width * 0.65;
        newCanvas.height = img.height * 0.65;

        // Get the context of the new canvas
        var ctx = newCanvas.getContext('2d');

        // Draw the image onto the new canvas
        ctx.drawImage(img, 0, 0, newCanvas.width, newCanvas.height);

        // Append the new canvas to the image container
        imageContainer.appendChild(newCanvas);
    };

    // Set the src of the image to the data URL
    img.src = data.drawing;
}

// Function to switch to the intial prompt entry of the first player in the game loop

let promptCountdown = 30;
let promptSubmitted = false;

function switchToPromptEntryScreen()
{
    document.getElementById('postLobbyCreationScreen').style.display = 'none'; 
    document.getElementById('entireDrawingScreen').style.display = 'none';
    document.getElementById("waitingScreen").style.display = 'none'; 
    document.getElementById("guessingScreen").style.display = 'none';
    document.getElementById("intialPromptScreen").style.display = 'flex'; //Show the prompt entering screen

    blockAutoButtonPresses();
    resetPromptTimer();
    let promptCounter = document.getElementById("promptCountdownTimer");
    let promptSubmitButton = document.getElementById("prompt-button");
    // Timer to end the session of prompting
    const promptCountdownInterval = setInterval(() => {
        promptCounter.innerText = promptCountdown + " seconds"; // Update counter text with countdown
        promptCountdown--;

        promptSubmitButton.addEventListener('click', function() {
            promptSubmitted = true;
            clearInterval(promptCountdownInterval);

        });

        if (promptCountdown < 0 && promptSubmitted == false) {
            promptCounter.innerText = "Prompting Time is Up"; // Update counter text when game starts
            console.log("Prompting is finished");
            clearInterval(promptCountdownInterval);
            promptSubmitButton.click();
        }
    }, 1000);
}

function resetDrawingTimer(){
    drawingCountdown = 60;
    console.log("Guess Timer has been reset");
    drawingSubmitted = false;
}

// Function to switch to the drawing screen and a prompt is provided to the player to ensure that they have a prompt to draw. 
function switchToDrawingScreen(data) {
    document.getElementById('postLobbyCreationScreen').style.display = 'none'; 
    document.getElementById("intialPromptScreen").style.display = 'none'; 
    document.getElementById("waitingScreen").style.display = 'none'; 
    document.getElementById("guessingScreen").style.display = 'none'; 
    document.getElementById('entireDrawingScreen').style.display = 'flex';
    document.getElementById('entireDrawingScreen').style.flexDirection = 'row';
    document.getElementById('entireDrawingScreen').style.justifyContent = 'center';

    console.log("Prompt To Be Drawn: " + data.prompt);

    document.getElementById("header-drawing-prompt").innerHTML = "Your Drawing Prompt is: " + data.prompt;

    // Create script element
    var scriptElement = document.createElement('script');
    scriptElement.setAttribute('src', '/scripts/classes/draw.js');
    
    // Append script element to drawingScreen div
    document.getElementById('entireDrawingScreen').appendChild(scriptElement);

    // Timer to start drawing session
    let drawingCounter = document.getElementById("countdownTimer");
    let drawingSubmitButton = document.getElementById("submitDrawingButton");

    blockAutoButtonPresses();
    resetDrawingTimer();
    const drawingCountdownInterval = setInterval(() => {
        drawingCounter.innerText = drawingCountdown + " seconds";
        drawingCountdown--;

        drawingSubmitButton.addEventListener('click', function() {
            drawingSubmitted = true;
            clearInterval(drawingCountdownInterval);
        });

        if (drawingCountdown == 5) {
            console.log("5 seconds left to submit drawing");
        }

        if (drawingCountdown < 0 && drawingSubmitted == false) {
            drawingCounter.innerText = "Time is Up!"; 
            setTimeout(function() {
                drawingSubmitButton.click();
            }, 500); // Delay of 2 seconds
            clearInterval(drawingCountdownInterval);
        }
    }, 1000);

    // Need to clear the canvas 
    // Assuming you have a reference to the canvas
    var canvas = document.getElementById('drawing-canvas');
    var ctx = canvas.getContext('2d');
    
    // Fill the canvas with white color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Function to make the div containing the endgame screen allowing for additional functionality such as displaying all drawings and prompts 
function endGame(data) {
    // Hide other screens
    document.getElementById('postLobbyCreationScreen').style.display = 'none'; 
    document.getElementById("intialPromptScreen").style.display = 'none'; 
    document.getElementById("waitingScreen").style.display = 'none'; 
    document.getElementById("guessingScreen").style.display = 'none'; 
    document.getElementById('entireDrawingScreen').style.display = 'none';

    // Show the end game screen
    document.getElementById('endGameScreen').style.display = 'flex';

    blockAutoButtonPresses();
    
    const displayDiv = document.getElementById('endGameResults');

    // Clear the contents of the display div
    displayDiv.innerHTML = '';

    // Iterate over the data
    for (let i = 0; i < data.drawingPrompts.length; i++) {
        if (i % 2 === 0 && data.drawingPrompts[i].prompt) {
            // If it's an even index and a prompt, create a new prompt container
            const promptContainer = document.createElement('p');
            promptContainer.className = 'player-prompt-heading';
            promptContainer.id = i === 0 ? 'initialPrompt' : 'finalPrompt';
            const promptText = i === 0 ? 'Initial Prompt: ' : 'Guess Prompt: ';
            promptContainer.textContent = promptText;
            const promptParagraph = document.createElement('p');
            promptParagraph.className = 'player-prompt';
            promptParagraph.textContent = data.drawingPrompts[i].prompt;
            displayDiv.appendChild(promptContainer);
            displayDiv.appendChild(promptParagraph);
        } else if (i % 2 === 1 && data.drawingPrompts[i].drawing) {
            // If it's an odd index and a drawing, create a new drawing container
            const drawingContainer = document.createElement('div');
            drawingContainer.id = i === 1 ? 'initialDrawing' : 'finalDrawing';
            const img = document.createElement('img');
            img.className = 'player-drawings';
            img.src = data.drawingPrompts[i].drawing;
            img.alt = 'Drawing';
            drawingContainer.appendChild(img);
            displayDiv.appendChild(drawingContainer);
        }
    }

    const returnToLobbyButton = document.getElementById("backToLobbyScreenButton");

    returnToLobbyButton.addEventListener('click', function() {
        window.location.reload();
    });
}

function clearPrompts() {
    const initialPromptContainer = document.getElementById('initialPrompt');
    const promptContainer = document.getElementById('finalPrompt');

    // Remove all child elements from the initialPromptContainer
    while (initialPromptContainer.firstChild) {
        initialPromptContainer.removeChild(initialPromptContainer.firstChild);
    }

    // Remove all child elements from the promptContainer
    while (promptContainer.firstChild) {
        promptContainer.removeChild(promptContainer.firstChild);
    }
}

export default {
    switchLobbyScreen,
    switchingGameScreen,
    createTimer,
    updateTimer,
    updateRemainingUsernames,
    setHost,
    clearPrompts
};

