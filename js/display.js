// Elementi del DOM
const lobbyScreen = document.getElementById('display-lobby');
const questionScreen = document.getElementById('display-question');
const scoresScreen = document.getElementById('display-scores');

const lobbyPlayerList = document.getElementById('lobby-player-list');
const questionText = document.getElementById('question-text');
const playerAnswersDisplay = document.getElementById('player-answers-display');


// Funzione per aggiornare la UI dello Schermo
function updateUI(gameState) {

    // Aggiorna sempre la lista giocatori nella lobby
    lobbyPlayerList.innerHTML = '';
    for (const id in gameState.players) {
        const player = gameState.players[id];
        const li = document.createElement('li');
        li.textContent = player.name;
        lobbyPlayerList.appendChild(li);
    }

    // Cambia schermata in base allo stato
    if (gameState.gameStatus === 'LOBBY') {
        lobbyScreen.classList.remove('hidden');
        questionScreen.classList.add('hidden');
        scoresScreen.classList.add('hidden');
    } 
    else if (gameState.gameStatus === 'IN_GAME') {
        lobbyScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        scoresScreen.classList.add('hidden');

        // Mostra la domanda
        questionText.textContent = gameState.currentQuestion.text;
        
        // Mostra chi ha risposto
        playerAnswersDisplay.innerHTML = '';
        for (const id in gameState.players) {
            const player = gameState.players[id];
            const span = document.createElement('span');
            span.className = 'player-status-bubble';
            if (player.answer) {
                span.classList.add('answered');
            }
            span.textContent = player.name.charAt(0); // Mostra l'iniziale
            playerAnswersDisplay.appendChild(span);
        }
    }
    else if (gameState.gameStatus === 'SCORES') {
        // (Logica per mostrare i punteggi)
    }
}

// L'ASCOLTATORE: Reagisce a TUTTI i cambiamenti
window.addEventListener('storage', (event) => {
    if (event.key === GAME_STATE_KEY) {
        console.log("Stato aggiornato, ridisegno lo schermo.");
        updateUI(getState());
    }
});

// Aggiorna la UI al caricamento
updateUI(getState());