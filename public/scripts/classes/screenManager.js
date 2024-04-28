function switchLobbyScreen(roomData){

    document.getElementById('lobbyContainer').style.display = 'none';
    document.getElementById('postLobbyCreationScreen').style.display = 'block';
    document.getElementById('postLobbyCreationScreen').className = "container"

    const lobbyDisplayElement = document.getElementById('postLobbyCreationScreen');
    const roomCode = document.createElement('p');
    roomCode.className = "room-code-container"

    lobbyDisplayElement.innerHTML = ``;
    roomCode.textContent = `Room Code: ${roomData}`;

    lobbyDisplayElement.appendChild(roomCode);
};

export default {
    switchLobbyScreen 
};

