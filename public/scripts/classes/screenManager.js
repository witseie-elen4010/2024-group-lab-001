function switchLobbyScreen(roomData){

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
    roomCode.textContent = `Room Code: ${roomData}`;
    lobbyDisplayElement.appendChild(roomCode);

    copyButton.textContent = 'Copy';
    copyButton.className = "copy-button"
    lobbyDisplayElement.appendChild(copyButton);
    copyToClipboard(copyButton, roomData);
};

function copyToClipboard(copyButton, roomData) {
    copyButton.addEventListener('click', function() {

        //  Create a temporary input element
        const tempInput = document.createElement('input');

        // Copy the text content of roomData paragraph
        tempInput.value = roomData; 

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

export default {
    switchLobbyScreen 
};

