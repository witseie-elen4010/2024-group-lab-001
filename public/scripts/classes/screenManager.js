import client from './client.js';

function switchLobbyScreen(roomId,playerCount){

    // Hide the lobby container and display the post lobby creation screen
    document.getElementById('lobbyContainer').style.display = 'none';
    document.getElementById('postLobbyCreationScreen').style.display = 'block';
    document.getElementById('postLobbyCreationScreen').className = "container"

    // Create a paragraph element to display the room code and button to copy the room code
    const lobbyDisplayElement = document.getElementById('postLobbyCreationScreen');
    const roomCode = document.createElement('p');
    const copyButton = document.createElement('button');

    roomCode.className = "room-code-container"
    lobbyDisplayElement.innerHTML = ``;
    roomCode.textContent = `Room Code: ${roomId}`;
    lobbyDisplayElement.appendChild(roomCode);

    copyButton.textContent = 'Copy';
    copyButton.className = "copy-button"
    lobbyDisplayElement.appendChild(copyButton);
    copyToClipboard(copyButton, roomId);

    // Create a button element to allow for the host to start the game when there is enough players
    const startgameButton = document.createElement('button');
    startgameButton.className = 'copy-button startgame-button';
    startgameButton.id = 'startgame-button';
    startgameButton.textContent = 'Start Game';
    startGame(startgameButton,playerCount,roomId);
    lobbyDisplayElement.appendChild(startgameButton);
};


function startGame(startgameButton,playerCount,roomId){
    if(playerCount<3){return};
    startgameButton.addEventListener('click', () => {
        console.log("Emitting start game");
        client.socket.emit('start-game', roomId);
        });
};

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
    switchToDrawingScreen
};

